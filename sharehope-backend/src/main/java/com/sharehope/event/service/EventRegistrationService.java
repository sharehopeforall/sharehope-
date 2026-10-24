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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventRegistrationService {
    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;

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

        String email = request.email() == null || request.email().isBlank()
                ? null
                : request.email().trim().toLowerCase(Locale.ROOT);
        if (email != null && registrationRepository.existsByEventIdAndEmailIgnoreCase(event.getId(), email)) {
            throw new ResourceAlreadyExistsException("This email is already registered for the event.");
        }

        if (event.getCapacity() != null) {
            long reserved = registrationRepository.reservedSeats(event.getId());
            if (reserved + request.guestCount() > event.getCapacity()) {
                throw new IllegalArgumentException("There are not enough seats available for this RSVP.");
            }
        }

        EventRegistration registration = registrationRepository.save(EventRegistration.builder()
                .event(event)
                .email(email)
                .fullName(request.fullName().trim())
                .guestCount(request.guestCount())
                .passType(request.passType().trim())
                .registrationType(request.registrationType() == null ? "RSVP" : request.registrationType())
                .locale(request.locale() == null ? "en" : request.locale())
                .build());

        return new EventRsvpResponse(registration.getId(), true);
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
}
