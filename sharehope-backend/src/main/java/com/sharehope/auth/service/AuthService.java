package com.sharehope.auth.service;

import com.sharehope.auth.dto.LoginRequest;
import com.sharehope.auth.dto.LoginResponse;
import com.sharehope.exception.InvalidCredentialsException;
import com.sharehope.exception.InvalidInvitationException;
import com.sharehope.role.model.Role;
import com.sharehope.security.JwtService;
import com.sharehope.user.dto.ActivateUserRequest;
import com.sharehope.user.model.User;
import com.sharehope.user.model.UserStatus;
import com.sharehope.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.util.HexFormat;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase();

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid email or password."
                        )
                );

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new InvalidCredentialsException(
                    "Invalid email or password."
            );
        }

        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash()
        )) {
            throw new InvalidCredentialsException(
                    "Invalid email or password."
            );
        }

        Role role = user.getRoles()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User does not have an assigned role."
                        )
                );

        String token = jwtService.generateToken(user, role.getName());

        return new LoginResponse(
                token,
                "Bearer",
                jwtService.getExpirationSeconds(),
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                role.getName()
        );
    }

    @Transactional
    public User activateUser(ActivateUserRequest request) {

        String tokenHash = hashToken(request.token());

        User user = userRepository
                .findByInvitationTokenHash(tokenHash)
                .orElseThrow(() ->
                        new InvalidInvitationException(
                                "Invalid or expired invitation token."
                        )
                );

        if (user.getStatus() != UserStatus.INVITED) {
            throw new InvalidInvitationException(
                    "This invitation has already been used."
            );
        }

        if (user.getInvitationExpiresAt() == null
                || user.getInvitationExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new InvalidInvitationException(
                    "This invitation has expired."
            );
        }

        OffsetDateTime now = OffsetDateTime.now();

        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setStatus(UserStatus.ACTIVE);
        user.setActivatedAt(now);
        user.setUpdatedAt(now);
        user.setInvitationTokenHash(null);
        user.setInvitationExpiresAt(null);

        return userRepository.save(user);
    }

    private String hashToken(String rawToken) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    rawToken.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "SHA-256 is not available",
                    e
            );
        }
    }
}
