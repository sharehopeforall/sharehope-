package com.sharehope.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.sharehope.auth.dto.ResetPasswordRequest;
import com.sharehope.notification.NotificationService;
import com.sharehope.security.JwtService;
import com.sharehope.user.model.User;
import com.sharehope.user.model.UserStatus;
import com.sharehope.user.repository.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class AuthServiceRecoveryTest {
    @Test
    void resetPasswordConsumesTokenAndRevokesExistingSessions() throws Exception {
        UserRepository users = mock(UserRepository.class);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        AuthService service = new AuthService(users, encoder,
                new JwtService("test-only-secret-that-is-at-least-thirty-two-characters-long", 30),
                mock(NotificationService.class),
                new TotpService("test-only-secret-that-is-at-least-thirty-two-characters-long"));
        String token = "secure-one-time-reset-token";
        User user = User.builder().id(UUID.randomUUID()).email("admin@sharehope.org")
                .status(UserStatus.ACTIVE).passwordHash(encoder.encode("Previous-password-123"))
                .passwordResetTokenHash(sha256(token)).passwordResetExpiresAt(OffsetDateTime.now().plusMinutes(10))
                .sessionVersion(3).createdAt(OffsetDateTime.now()).updatedAt(OffsetDateTime.now()).build();
        when(users.findByPasswordResetTokenHash(sha256(token))).thenReturn(Optional.of(user));

        service.resetPassword(new ResetPasswordRequest(token, "Replacement-password-456"));

        assertThat(encoder.matches("Replacement-password-456", user.getPasswordHash())).isTrue();
        assertThat(user.getPasswordResetTokenHash()).isNull();
        assertThat(user.getPasswordResetExpiresAt()).isNull();
        assertThat(user.getSessionVersion()).isEqualTo(4);
        assertThat(user.getPasswordChangedAt()).isNotNull();
        verify(users).save(user);
    }

    private static String sha256(String value) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                .digest(value.getBytes(StandardCharsets.UTF_8)));
    }
}
