package com.sharehope.user.service;

import com.sharehope.exception.ResourceAlreadyExistsException;
import com.sharehope.exception.ResourceNotFoundException;
import com.sharehope.role.model.Role;
import com.sharehope.role.repository.RoleRepository;
import com.sharehope.user.dto.InviteUserRequest;
import com.sharehope.user.model.User;
import com.sharehope.user.model.UserStatus;
import com.sharehope.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.HashSet;
import java.util.HexFormat;

@Service
public class UserService {

    private static final int TOKEN_BYTES = 32;
    private static final long INVITATION_EXPIRATION_HOURS = 48;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Transactional
    public InviteUserResult inviteUser(
            InviteUserRequest request,
            User invitedBy
    ) {

        String normalizedEmail =
                request.email().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResourceAlreadyExistsException(
                    "A user with this email already exists."
            );
        }

        Role role = roleRepository
                .findByName(request.role().name())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found: " + request.role().name()
                        )
                );

        String rawToken = generateSecureToken();
        String tokenHash = hashToken(rawToken);

        OffsetDateTime now = OffsetDateTime.now();

        User user = User.builder()
                .firstName(request.firstName().trim())
                .lastName(request.lastName().trim())
                .email(normalizedEmail)
                .passwordHash(null)
                .status(UserStatus.INVITED)
                .invitationTokenHash(tokenHash)
                .invitationExpiresAt(
                        now.plusHours(INVITATION_EXPIRATION_HOURS)
                )
                .invitedAt(now)
                .invitedBy(invitedBy)
                .createdAt(now)
                .updatedAt(now)
                .roles(new HashSet<>())
                .build();

        user.getRoles().add(role);

        User savedUser = userRepository.save(user);

        return new InviteUserResult(
                savedUser,
                rawToken
        );
    }

    private String generateSecureToken() {

        byte[] tokenBytes = new byte[TOKEN_BYTES];

        secureRandom.nextBytes(tokenBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(tokenBytes);
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
