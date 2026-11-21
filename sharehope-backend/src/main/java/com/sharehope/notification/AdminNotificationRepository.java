package com.sharehope.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface AdminNotificationRepository extends JpaRepository<AdminNotification, UUID> {
    List<AdminNotification> findTop30ByRecipientIdOrderByCreatedAtDesc(UUID recipientId);
    long countByRecipientIdAndReadAtIsNull(UUID recipientId);
    Optional<AdminNotification> findByIdAndRecipientId(UUID id, UUID recipientId);
    List<AdminNotification> findByRecipientIdAndReadAtIsNull(UUID recipientId);
    boolean existsByRecipientIdAndEntityKey(UUID recipientId, String entityKey);
}
