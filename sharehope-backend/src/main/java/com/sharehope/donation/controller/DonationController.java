package com.sharehope.donation.controller;

import com.sharehope.donation.dto.DonationRecordRequest;
import com.sharehope.donation.model.Donation;
import com.sharehope.donation.repository.DonationRepository;
import com.sharehope.donation.service.DonationManageTokenService;
import com.sharehope.notification.NotificationService;
import jakarta.validation.Valid;
import java.time.OffsetDateTime;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
public class DonationController {
    private final DonationRepository repo;
    private final String secret;
    private final NotificationService notifications;
    private final DonationManageTokenService manageTokens;

    DonationController(DonationRepository repo, @Value("${app.payment.internal-secret:}") String secret,
                       NotificationService notifications, DonationManageTokenService manageTokens) {
        this.repo = repo;
        this.secret = secret;
        this.notifications = notifications;
        this.manageTokens = manageTokens;
    }

    @PostMapping("/api/public/payment-events")
    public ResponseEntity<?> record(@RequestHeader(value = "X-Payment-Secret", required = false) String supplied,
                                    @Valid @RequestBody DonationRecordRequest request) {
        if (!authorized(supplied)) return ResponseEntity.status(401).build();
        boolean created = repo.findByProviderReference(request.providerReference()).isEmpty();
        Donation donation = repo.findByProviderReference(request.providerReference())
                .orElseGet(() -> Donation.builder().providerReference(request.providerReference()).build());
        donation.setProvider(request.provider());
        if (request.subscriptionReference() != null && !request.subscriptionReference().isBlank()) donation.setSubscriptionReference(request.subscriptionReference());
        if (request.donorName() != null && !request.donorName().isBlank()) donation.setDonorName(request.donorName());
        if (request.donorEmail() != null && !request.donorEmail().isBlank()) donation.setDonorEmail(request.donorEmail());
        if (request.donorPhone() != null && !request.donorPhone().isBlank()) donation.setDonorPhone(request.donorPhone());
        donation.setAmountCents(request.amountCents());
        donation.setCurrency(request.currency().toUpperCase());
        donation.setFrequency(request.frequency());
        if ("Monthly".equalsIgnoreCase(request.frequency()) && donation.getSubscriptionStatus() == null
                && "Succeeded".equalsIgnoreCase(request.status())) donation.setSubscriptionStatus("Active");
        donation.setDesignation(request.designation());
        donation.setStatus(request.status());
        if (request.receiptUrl() != null && !request.receiptUrl().isBlank()) donation.setReceiptUrl(request.receiptUrl());
        donation = repo.save(donation);
        if (created) notifications.sendAdminAlert("New ShareHope donation", "/en/admin/donations");
        if ("Succeeded".equalsIgnoreCase(donation.getStatus()) && donation.getConfirmationSentAt() == null
                && notifications.sendDonationConfirmation(donation)) {
            donation.setConfirmationSentAt(OffsetDateTime.now());
            donation = repo.save(donation);
        }
        return ResponseEntity.ok(donation);
    }

    @GetMapping("/api/public/donations/manage/{token}")
    public ResponseEntity<?> manage(@PathVariable String token) {
        return manageTokens.verify(token)
                .filter(donation -> "Monthly".equalsIgnoreCase(donation.getFrequency()))
                .filter(donation -> donation.getSubscriptionReference() != null && !donation.getSubscriptionReference().isBlank())
                .<ResponseEntity<?>>map(donation -> ResponseEntity.ok(Map.of(
                        "provider", donation.getProvider(),
                        "providerReference", donation.getProviderReference(),
                        "subscriptionReference", donation.getSubscriptionReference(),
                        "status", donation.getSubscriptionStatus() == null ? donation.getStatus() : donation.getSubscriptionStatus(),
                        "amountCents", donation.getAmountCents(),
                        "currency", donation.getCurrency(),
                        "designation", donation.getDesignation() == null ? "general" : donation.getDesignation())))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/api/public/payment-events/{reference}")
    public ResponseEntity<?> status(@RequestHeader(value = "X-Payment-Secret", required = false) String supplied,
                                    @PathVariable String reference, @RequestBody Map<String, String> body) {
        if (!authorized(supplied)) return ResponseEntity.status(401).build();
        List<Donation> matches = new ArrayList<>(repo.findAllBySubscriptionReference(reference));
        repo.findByProviderReference(reference).ifPresent(donation -> {
            if (matches.stream().noneMatch(existing -> existing.getId().equals(donation.getId()))) matches.add(donation);
        });
        if (matches.isEmpty()) return ResponseEntity.notFound().build();
        String status = body.getOrDefault("status", matches.get(0).getStatus());
        Donation response = null;
        boolean cancellationAlreadySent = matches.stream().anyMatch(donation -> donation.getCancellationSentAt() != null);
        Donation cancellationRecipient = matches.stream()
                .filter(donation -> donation.getDonorEmail() != null && !donation.getDonorEmail().isBlank())
                .max(Comparator.comparing(Donation::getCreatedAt)).orElse(null);
        for (Donation donation : matches) {
            donation.setSubscriptionStatus(status);
            if (!cancellationAlreadySent && donation == cancellationRecipient && "Cancelled".equalsIgnoreCase(status)
                    && notifications.sendDonationCancellation(donation)) {
                donation.setCancellationSentAt(OffsetDateTime.now());
                cancellationAlreadySent = true;
            }
            response = repo.save(donation);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/admin/donations")
    public List<Donation> list() { return repo.findAllByOrderByCreatedAtDesc(); }

    private boolean authorized(String supplied) { return !secret.isBlank() && secret.equals(supplied); }
}
