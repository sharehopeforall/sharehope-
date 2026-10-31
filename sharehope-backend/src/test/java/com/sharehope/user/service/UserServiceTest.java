package com.sharehope.user.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.sharehope.role.model.AdminRole;
import com.sharehope.role.model.Role;
import com.sharehope.role.repository.RoleRepository;
import com.sharehope.user.dto.InviteUserRequest;
import com.sharehope.user.model.User;
import com.sharehope.user.model.UserStatus;
import com.sharehope.user.repository.UserRepository;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.time.LocalDateTime;
import java.util.HexFormat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @BeforeEach
    void seedRole() {
        if (roleRepository.findByName("CONTENT_EDITOR").isEmpty()) {
            LocalDateTime now = LocalDateTime.now();
            roleRepository.save(Role.builder().name("CONTENT_EDITOR").description("Content editor").createdAt(now).updatedAt(now).build());
        }
    }

    @Test
    void inviteUser_createsInvitedUserWithHashedTokenAndAssignedRole() throws Exception {
        InviteUserRequest request = new InviteUserRequest(
                "Deborah",
                "Donyoh",
                "deborah@sharehope.org",
                AdminRole.CONTENT_EDITOR
        );

        InviteUserResult result = userService.inviteUser(request, null);

        assertThat(result.rawToken()).isNotBlank();

        User saved = userRepository.findById(result.user().getId()).orElseThrow();

        assertThat(saved.getEmail()).isEqualTo("deborah@sharehope.org");
        assertThat(saved.getFirstName()).isEqualTo("Deborah");
        assertThat(saved.getLastName()).isEqualTo("Donyoh");
        assertThat(saved.getStatus()).isEqualTo(UserStatus.INVITED);
        assertThat(saved.getPasswordHash()).isNull();

        assertThat(saved.getRoles())
                .extracting(role -> role.getName())
                .containsExactly("CONTENT_EDITOR");

        // The raw token must never be stored as-is; only its SHA-256 hash should be persisted.
        assertThat(saved.getInvitationTokenHash())
                .isNotNull()
                .isNotEqualTo(result.rawToken())
                .isEqualTo(sha256Hex(result.rawToken()));

        assertThat(saved.getInvitationExpiresAt()).isAfter(OffsetDateTime.now());
        assertThat(saved.getInvitedAt()).isNotNull();
        assertThat(saved.getInvitedBy()).isNull();
    }

    private static String sha256Hex(String value) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(value.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(hash);
    }
}
