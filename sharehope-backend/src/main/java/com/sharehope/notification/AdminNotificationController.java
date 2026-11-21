package com.sharehope.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController @RequestMapping("/api/admin/notifications") @RequiredArgsConstructor
public class AdminNotificationController {
    private final AdminNotificationService service;
    @GetMapping public AdminNotificationService.Feed list(@AuthenticationPrincipal Jwt jwt) {
        return service.feed(UUID.fromString(jwt.getSubject()));
    }
    @PatchMapping("/{id}/read") public AdminNotificationService.Item read(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        return service.markRead(UUID.fromString(jwt.getSubject()), id);
    }
    @PostMapping("/read-all") public ResponseEntity<Void> readAll(@AuthenticationPrincipal Jwt jwt) {
        service.markAllRead(UUID.fromString(jwt.getSubject()));
        return ResponseEntity.noContent().build();
    }
}
