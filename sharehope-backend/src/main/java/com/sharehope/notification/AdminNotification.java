package com.sharehope.notification;

import com.sharehope.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "admin_notifications")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AdminNotification {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;
    @Column(nullable = false, length = 60) private String type;
    @Column(nullable = false, length = 20) private String severity;
    @Column(nullable = false, length = 180) private String title;
    @Column(nullable = false, length = 500) private String message;
    @Column(name = "action_url", length = 300) private String actionUrl;
    @Column(name = "entity_key", length = 180) private String entityKey;
    @Column(name = "created_at", nullable = false) private OffsetDateTime createdAt;
    @Column(name = "read_at") private OffsetDateTime readAt;
}
