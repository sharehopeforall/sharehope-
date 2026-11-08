package com.sharehope.event.service;

import com.sharehope.event.dto.EventRsvpRequest;
import com.sharehope.event.dto.EventRsvpResponse;
import com.sharehope.event.dto.EventRegistrationResponse;
import com.sharehope.event.model.Event;
import com.sharehope.event.model.EventRegistration;
import com.sharehope.event.repository.EventRegistrationRepository;
import com.sharehope.event.repository.EventRepository;
import com.sharehope.exception.ResourceAlreadyExistsException;
import com.sharehope.exception.ResourceNotFoundException;
import com.sharehope.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.List;
import java.util.UUID;
import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class EventRegistrationService {
    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final NotificationService notifications;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional(readOnly = true)
    public List<EventRegistrationResponse> listForEvent(UUID eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found.");
        }
        return registrationRepository.findByEventIdOrderByCreatedAtDesc(eventId).stream()
                .map(registration -> new EventRegistrationResponse(
                        registration.getId(),
                        registration.getFullName(),
                        registration.getEmail(),
                        registration.getGuestCount(),
                        registration.getPassType(),
                        registration.getRegistrationType(),
                        registration.getLocale(),
                        registration.getStatus(),
                        registration.getCheckedInAt(),
                        registration.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public EventRsvpResponse register(String slug, EventRsvpRequest request) {
        Event event = eventRepository.findBySlugForRegistration(slug)
                .filter(candidate -> "PUBLISHED".equals(candidate.getStatus()))
                .orElseThrow(() -> new ResourceNotFoundException("Event not found."));

        if (event.getStartAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("Registration for this event has closed.");
        }

        boolean volunteer = "VOLUNTEER".equals(request.registrationType());
        if (volunteer && !event.getEnableVolunteer()) {
            throw new IllegalArgumentException("Volunteer registration is not enabled for this event.");
        }
        if (!volunteer && !event.getEnableRsvp()) {
            throw new IllegalArgumentException("RSVP is not enabled for this event.");
        }

        if (volunteer) {
            if (!request.passType().startsWith("Volunteer — ")) {
                throw new IllegalArgumentException("Select a valid volunteer role for this event.");
            }
            String selectedRole = request.passType().replaceFirst("^Volunteer — ", "").trim();
            Object requestedTranslation = event.getTranslations().getOrDefault(
                    request.locale() == null ? "en" : request.locale(),
                    event.getTranslations().get("en")
            );
            boolean validRole = java.util.stream.Stream.ofNullable(requestedTranslation)
                    .flatMap(translationValue -> {
                        if (!(translationValue instanceof java.util.Map<?, ?> translation)) return java.util.stream.Stream.empty();
                        Object rolesValue = translation.get("roles");
                        if (!(rolesValue instanceof java.util.List<?> roles)) return java.util.stream.Stream.empty();
                        return roles.stream().map(String::valueOf);
                    })
                    .anyMatch(selectedRole::equals);
            if (!validRole) {
                throw new IllegalArgumentException("Select a valid volunteer role for this event.");
            }
        }

        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email is required to verify the registration.");
        }
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        registrationRepository.findByEventIdAndEmailIgnoreCase(event.getId(), email).ifPresent(existing -> {
            boolean expiredPending = "PENDING_CONFIRMATION".equals(existing.getStatus())
                    && existing.getConfirmationExpiresAt() != null
                    && !existing.getConfirmationExpiresAt().isAfter(OffsetDateTime.now());
            if (expiredPending) registrationRepository.delete(existing);
            else throw new ResourceAlreadyExistsException("This email is already registered for the event.");
        });

        if (event.getCapacity() != null) {
            long reserved = registrationRepository.reservedSeats(event.getId());
            if (reserved + request.guestCount() > event.getCapacity()) {
                throw new IllegalArgumentException("There are not enough seats available for this RSVP.");
            }
        }

        String confirmationToken = generateToken();
        EventRegistration registration = registrationRepository.save(EventRegistration.builder()
                .event(event)
                .email(email)
                .fullName(request.fullName().trim())
                .guestCount(request.guestCount())
                .passType(request.passType().trim())
                .registrationType(request.registrationType() == null ? "RSVP" : request.registrationType())
                .locale(request.locale() == null ? "en" : request.locale())
                .status("PENDING_CONFIRMATION")
                .confirmationTokenHash(hashToken(confirmationToken))
                .confirmationExpiresAt(OffsetDateTime.now().plusMinutes(30))
                .build());

        if (!notifications.sendEventRegistrationVerification(event, registration, confirmationToken)) {
            registrationRepository.delete(registration);
            throw new IllegalStateException("The verification email could not be sent. Please try again later.");
        }

        return new EventRsvpResponse(registration.getId(), true, true);
    }

    @Transactional
    public EventRsvpResponse confirm(String rawToken) {
        EventRegistration registration = registrationRepository.findByConfirmationTokenHash(hashToken(rawToken))
                .filter(item -> "PENDING_CONFIRMATION".equals(item.getStatus()))
                .filter(item -> item.getConfirmationExpiresAt() != null && item.getConfirmationExpiresAt().isAfter(OffsetDateTime.now()))
                .orElseThrow(() -> new IllegalArgumentException("This confirmation link is invalid or expired."));
        Event event = eventRepository.findBySlugForRegistration(registration.getEvent().getSlug())
                .filter(candidate -> "PUBLISHED".equals(candidate.getStatus()))
                .orElseThrow(() -> new ResourceNotFoundException("Event not found."));
        if (event.getStartAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException("Registration for this event has closed.");
        }
        if (event.getCapacity() != null
                && registrationRepository.reservedSeats(event.getId()) + registration.getGuestCount() > event.getCapacity()) {
            throw new IllegalArgumentException("This event filled up before the email address was confirmed.");
        }
        registration.setStatus("CONFIRMED");
        registration.setConfirmedAt(OffsetDateTime.now());
        registration.setConfirmationTokenHash(null);
        registration.setConfirmationExpiresAt(null);
        registrationRepository.save(registration);
        if ("VOLUNTEER".equals(registration.getRegistrationType())) {
            notifications.sendAdminAlert("New event volunteer registration", "/en/admin/events");
        }
        notifications.sendEventRegistrationConfirmed(event, registration);
        return new EventRsvpResponse(registration.getId(), true, false);
    }

    @Transactional
    public EventRegistrationResponse updateStatus(UUID eventId, UUID registrationId, String status) {
        EventRegistration registration = registrationRepository.findById(registrationId)
                .filter(item -> item.getEvent().getId().equals(eventId))
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found."));
        if ("CANCELLED".equals(registration.getStatus()) && !"CANCELLED".equals(status)) {
            Event event = eventRepository.findBySlugForRegistration(registration.getEvent().getSlug())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found."));
            if (event.getCapacity() != null && registrationRepository.reservedSeats(eventId) + registration.getGuestCount() > event.getCapacity()) {
                throw new IllegalArgumentException("There are not enough seats available to restore this registration.");
            }
        }
        registration.setStatus(status);
        registration.setCheckedInAt("CHECKED_IN".equals(status) ? OffsetDateTime.now() : null);
        registrationRepository.save(registration);
        return new EventRegistrationResponse(registration.getId(), registration.getFullName(), registration.getEmail(), registration.getGuestCount(), registration.getPassType(), registration.getRegistrationType(), registration.getLocale(), registration.getStatus(), registration.getCheckedInAt(), registration.getCreatedAt());
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String token) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception error) {
            throw new IllegalStateException("Unable to protect confirmation token", error);
        }
    }
}
