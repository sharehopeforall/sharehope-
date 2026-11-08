package com.sharehope.donation.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "donations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Donation {
    @Id private UUID id;
    @Column(nullable = false, length = 20) private String provider;
    @Column(name = "provider_reference", nullable = false, unique = true, length = 200) private String providerReference;
    @Column(name = "subscription_reference", length = 200) private String subscriptionReference;
    @Column(name = "subscription_status", length = 30) private String subscriptionStatus;
    @Column(name = "donor_name", length = 200) private String donorName;
    @Column(name = "donor_email", length = 320) private String donorEmail;
    @Column(name = "donor_phone", length = 40) private String donorPhone;
    @Column(name = "amount_cents", nullable = false) private Long amountCents;
    @Column(nullable = false, length = 3) private String currency;
    @Column(nullable = false, length = 20) private String frequency;
    @Column(length = 120) private String designation;
    @Column(nullable = false, length = 30) private String status;
    @Column(name = "receipt_url", columnDefinition = "text") private String receiptUrl;
    @Column(name = "confirmation_sent_at") private OffsetDateTime confirmationSentAt;
    @Column(name = "cancellation_sent_at") private OffsetDateTime cancellationSentAt;
    @Column(name = "created_at", nullable = false) private OffsetDateTime createdAt;
    @Column(name = "updated_at", nullable = false) private OffsetDateTime updatedAt;

    @PrePersist
    void create() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = OffsetDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void update() {
        updatedAt = OffsetDateTime.now();
    }
}
