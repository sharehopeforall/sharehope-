package com.sharehope.notification;

import com.sharehope.user.model.UserStatus;
import com.sharehope.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.*;

@Service @RequiredArgsConstructor @Slf4j
public class AdminNotificationService {
    private final AdminNotificationRepository repository;
    private final UserRepository users;

    @Transactional
    public void notifyAdmins(String type, String severity, String title, String message, String actionUrl, String entityKey) {
        try {
            for (var user : users.findAllByStatus(UserStatus.ACTIVE)) {
                if (entityKey != null && repository.existsByRecipientIdAndEntityKey(user.getId(), entityKey)) continue;
                repository.save(AdminNotification.builder().id(UUID.randomUUID()).recipient(user)
                        .type(type).severity(severity).title(title).message(message).actionUrl(actionUrl)
                        .entityKey(entityKey).createdAt(OffsetDateTime.now()).build());
            }
        } catch (RuntimeException error) {
            log.error("Unable to create admin notification {}", entityKey, error);
        }
    }

    @Transactional(readOnly = true)
    public Feed feed(UUID userId) {
        return new Feed(repository.findTop30ByRecipientIdOrderByCreatedAtDesc(userId).stream().map(Item::from).toList(),
                repository.countByRecipientIdAndReadAtIsNull(userId));
    }

    @Transactional
    public Item markRead(UUID userId, UUID id) {
        var item = repository.findByIdAndRecipientId(id, userId).orElseThrow();
        if (item.getReadAt() == null) item.setReadAt(OffsetDateTime.now());
        return Item.from(repository.save(item));
    }

    @Transactional
    public void markAllRead(UUID userId) {
        var unread = repository.findByRecipientIdAndReadAtIsNull(userId);
        var now = OffsetDateTime.now();
        unread.forEach(item -> item.setReadAt(now));
        repository.saveAll(unread);
    }

    public record Feed(List<Item> items, long unreadCount) {}
    public record Item(UUID id, String type, String severity, String title, String message,
                       String actionUrl, OffsetDateTime createdAt, OffsetDateTime readAt) {
        static Item from(AdminNotification n) { return new Item(n.getId(), n.getType(), n.getSeverity(), n.getTitle(),
                n.getMessage(), n.getActionUrl(), n.getCreatedAt(), n.getReadAt()); }
    }
}
