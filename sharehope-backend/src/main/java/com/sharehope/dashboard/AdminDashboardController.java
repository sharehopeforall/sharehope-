package com.sharehope.dashboard;

import com.sharehope.donation.repository.DonationRepository;
import com.sharehope.event.model.EventRegistration;
import com.sharehope.event.repository.EventRegistrationRepository;
import com.sharehope.newsletter.repository.NewsletterSubscriberRepository;
import com.sharehope.submission.repository.PublicSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final DonationRepository donations;
    private final PublicSubmissionRepository submissions;
    private final NewsletterSubscriberRepository subscribers;
    private final EventRegistrationRepository registrations;

    @GetMapping
    @Transactional(readOnly = true)
    public DashboardResponse dashboard() {
        var successful = donations.findAllByOrderByCreatedAtDesc().stream()
                .filter(donation -> "Succeeded".equalsIgnoreCase(donation.getStatus()))
                .toList();
        long donationTotalCents = successful.stream().mapToLong(donation -> donation.getAmountCents()).sum();
        long activeMonthlyDonors = successful.stream()
                .filter(donation -> "Monthly".equalsIgnoreCase(donation.getFrequency()))
                .filter(donation -> donation.getSubscriptionStatus() == null || "Active".equalsIgnoreCase(donation.getSubscriptionStatus()))
                .map(donation -> donation.getSubscriptionReference() != null ? donation.getSubscriptionReference() : donation.getDonorEmail())
                .filter(Objects::nonNull).distinct().count();
        long newApplications = submissions.findAllByOrderByCreatedAtDesc().stream()
                .filter(submission -> "NEW".equalsIgnoreCase(submission.getStatus())).count();
        var recent = registrations.findTop6ByOrderByCreatedAtDesc().stream().map(RecentRegistration::from).toList();
        return new DashboardResponse(donationTotalCents, successful.size(), activeMonthlyDonors,
                newApplications, subscribers.count(), registrations.countUpcomingVolunteers(OffsetDateTime.now()), recent,
                OffsetDateTime.now());
    }

    public record DashboardResponse(long donationTotalCents, long successfulDonations, long activeMonthlyDonors,
                                    long newApplications, long newsletterSubscribers, long upcomingVolunteers,
                                    List<RecentRegistration> recentRegistrations, OffsetDateTime generatedAt) {}
    public record RecentRegistration(UUID id, String fullName, String registrationType, String status,
                                     String eventTitle, OffsetDateTime createdAt) {
        @SuppressWarnings("unchecked")
        static RecentRegistration from(EventRegistration registration) {
            Object value = registration.getEvent().getTranslations().get("en");
            Map<String, Object> translation = value instanceof Map<?, ?> map ? (Map<String, Object>) map : Map.of();
            return new RecentRegistration(registration.getId(), registration.getFullName(), registration.getRegistrationType(),
                    registration.getStatus(), String.valueOf(translation.getOrDefault("title", registration.getEvent().getSlug())),
                    registration.getCreatedAt());
        }
    }
}
