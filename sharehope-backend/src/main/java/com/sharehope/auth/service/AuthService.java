package com.sharehope.auth.service;

import com.sharehope.auth.dto.LoginRequest;
import com.sharehope.auth.dto.LoginResponse;
import com.sharehope.exception.InvalidCredentialsException;
import com.sharehope.exception.InvalidInvitationException;
import com.sharehope.role.model.Role;
import com.sharehope.security.JwtService;
import com.sharehope.notification.NotificationService;
import com.sharehope.auth.dto.ChangePasswordRequest;
import com.sharehope.auth.dto.ChangeEmailRequest;
import com.sharehope.auth.dto.ResetPasswordRequest;
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
import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;
import java.util.HexFormat;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String dummyPasswordHash;
    private final NotificationService notifications;
    private final PasswordPolicy passwordPolicy;
    private final TotpService totp;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            NotificationService notifications,
            PasswordPolicy passwordPolicy,
            TotpService totp
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.dummyPasswordHash = passwordEncoder.encode("not-a-real-password");
        this.notifications = notifications;
        this.passwordPolicy = passwordPolicy;
        this.totp = totp;
    }

    public LoginResponse login(LoginRequest request) {

        String email = request.email()
                .trim()
                .toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        boolean validPassword = passwordEncoder.matches(request.password(),
                user != null && user.getStatus() == UserStatus.ACTIVE && user.getPasswordHash() != null
                        ? user.getPasswordHash() : dummyPasswordHash);
        if (user == null || user.getStatus() != UserStatus.ACTIVE || !validPassword) {
            throw new InvalidCredentialsException(
                    "Invalid email or password."
            );
        }

        if (Boolean.TRUE.equals(user.getMfaEnabled()) && (user.getMfaSecretEncrypted() == null
                || !totp.verify(totp.decrypt(user.getMfaSecretEncrypted()), request.mfaCode()))) {
            throw new InvalidCredentialsException("A valid authenticator code is required.");
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
                role.getName(),
                "SUPER_ADMIN".equals(role.getName()) && !Boolean.TRUE.equals(user.getMfaEnabled())
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

        passwordPolicy.validate(request.password(), user);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setStatus(UserStatus.ACTIVE);
        user.setActivatedAt(now);
        user.setUpdatedAt(now);
        user.setInvitationTokenHash(null);
        user.setInvitationExpiresAt(null);
        user.setPasswordChangedAt(now);

        return userRepository.save(user);
    }

    @Transactional
    public void requestPasswordReset(String rawEmail) {
        String email = rawEmail.trim().toLowerCase();
        userRepository.findByEmailIgnoreCase(email)
                .filter(user -> user.getStatus() == UserStatus.ACTIVE)
                .ifPresent(user -> {
                    String token = generateSecureToken();
                    user.setPasswordResetTokenHash(hashToken(token));
                    user.setPasswordResetExpiresAt(OffsetDateTime.now().plusMinutes(30));
                    user.setUpdatedAt(OffsetDateTime.now());
                    userRepository.save(user);
                    notifications.sendPasswordReset(user, token);
                });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetTokenHash(hashToken(request.token()))
                .filter(candidate -> candidate.getStatus() == UserStatus.ACTIVE)
                .filter(candidate -> candidate.getPasswordResetExpiresAt() != null
                        && candidate.getPasswordResetExpiresAt().isAfter(OffsetDateTime.now()))
                .orElseThrow(() -> new InvalidInvitationException("Invalid or expired password reset link."));
        applyNewPassword(user, request.password());
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .filter(candidate -> candidate.getStatus() == UserStatus.ACTIVE)
                .orElseThrow(() -> new InvalidCredentialsException("Authenticated user not found."));
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Current password is incorrect.");
        }
        applyNewPassword(user, request.newPassword());
    }

    @Transactional
    public void changeEmail(UUID userId, ChangeEmailRequest request) {
        User user = userRepository.findById(userId)
                .filter(candidate -> candidate.getStatus() == UserStatus.ACTIVE)
                .orElseThrow(() -> new InvalidCredentialsException("Authenticated user not found."));
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Current password is incorrect.");
        }
        String email = request.email().trim().toLowerCase();
        if (email.equalsIgnoreCase(user.getEmail())) throw new IllegalArgumentException("Enter a different email address.");
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new com.sharehope.exception.ResourceAlreadyExistsException("An administrator with this email already exists.");
        }
        user.setEmail(email);
        user.setSessionVersion(user.getSessionVersion() + 1);
        user.setPasswordResetTokenHash(null);
        user.setPasswordResetExpiresAt(null);
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public void logout(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidCredentialsException("Authenticated user not found."));
        user.setSessionVersion(user.getSessionVersion() + 1);
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public java.util.Map<String, Object> beginMfaSetup(UUID userId) {
        User user = activeUser(userId);
        String secret = totp.generateSecret();
        user.setMfaSecretEncrypted(totp.encrypt(secret));
        user.setMfaEnabled(false);
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);
        String label = java.net.URLEncoder.encode("ShareHope:" + user.getEmail(), StandardCharsets.UTF_8);
        return java.util.Map.of("secret", secret,
                "otpauthUri", "otpauth://totp/" + label + "?secret=" + secret + "&issuer=ShareHope&digits=6&period=30");
    }

    @Transactional
    public void enableMfa(UUID userId, String code) {
        User user = activeUser(userId);
        if (user.getMfaSecretEncrypted() == null || !totp.verify(totp.decrypt(user.getMfaSecretEncrypted()), code)) {
            throw new InvalidCredentialsException("Authenticator code is invalid.");
        }
        user.setMfaEnabled(true);
        user.setSessionVersion(user.getSessionVersion() + 1);
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public void disableMfa(UUID userId, String code) {
        User user = activeUser(userId);
        if (!Boolean.TRUE.equals(user.getMfaEnabled()) || user.getMfaSecretEncrypted() == null
                || !totp.verify(totp.decrypt(user.getMfaSecretEncrypted()), code)) {
            throw new InvalidCredentialsException("Authenticator code is invalid.");
        }
        user.setMfaEnabled(false);
        user.setMfaSecretEncrypted(null);
        user.setSessionVersion(user.getSessionVersion() + 1);
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);
    }

    public boolean mfaEnabled(UUID userId) {
        return Boolean.TRUE.equals(activeUser(userId).getMfaEnabled());
    }

    private User activeUser(UUID userId) {
        return userRepository.findById(userId).filter(user -> user.getStatus() == UserStatus.ACTIVE)
                .orElseThrow(() -> new InvalidCredentialsException("Authenticated user not found."));
    }

    private void applyNewPassword(User user, String password) {
        passwordPolicy.validate(password, user);
        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("New password must be different from the current password.");
        }
        OffsetDateTime now = OffsetDateTime.now();
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setPasswordResetTokenHash(null);
        user.setPasswordResetExpiresAt(null);
        user.setPasswordChangedAt(now);
        user.setSessionVersion(user.getSessionVersion() + 1);
        user.setUpdatedAt(now);
        userRepository.save(user);
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
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
