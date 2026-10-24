package com.sharehope.event.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "event_registrations", uniqueConstraints = @UniqueConstraint(name = "uk_event_registration_email", columnNames = {"event_id", "email"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistration {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(length = 320)
    private String email;

    @Column(name = "full_name", nullable = false, length = 160)
    private String fullName;

    @Column(name = "guest_count", nullable = false)
    private Integer guestCount;

    @Column(name = "pass_type", nullable = false, length = 80)
    private String passType;

    @Column(name = "registration_type", nullable = false, length = 20)
    private String registrationType;

    @Column(nullable = false, length = 5)
    private String locale;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "checked_in_at")
    private OffsetDateTime checkedInAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void create() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = OffsetDateTime.now();
        if (status == null) status = "CONFIRMED";
        if (registrationType == null) registrationType = "RSVP";
    }
}
