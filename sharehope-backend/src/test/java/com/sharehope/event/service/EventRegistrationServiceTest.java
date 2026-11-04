package com.sharehope.event.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.sharehope.event.dto.EventRsvpRequest;
import com.sharehope.event.model.Event;
import com.sharehope.event.repository.EventRegistrationRepository;
import com.sharehope.event.repository.EventRepository;
import com.sharehope.notification.NotificationService;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class EventRegistrationServiceTest {
    private final EventRepository events = mock(EventRepository.class);
    private final EventRegistrationRepository registrations = mock(EventRegistrationRepository.class);
    private final EventRegistrationService service = new EventRegistrationService(
            events, registrations, mock(NotificationService.class));

    @Test
    void rejectsVolunteerRoleThatIsNotConfiguredForTheEvent() {
        Event event = volunteerEvent();
        when(events.findBySlugForRegistration("community-day")).thenReturn(Optional.of(event));

        assertThatThrownBy(() -> service.register("community-day", new EventRsvpRequest(
                "Alex Volunteer", "alex@example.org", 1, "Volunteer — Invented role", "VOLUNTEER", "en")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("valid volunteer role");

        verify(registrations, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void requiresEmailForVolunteerRegistration() {
        when(events.findBySlugForRegistration("community-day")).thenReturn(Optional.of(volunteerEvent()));

        assertThatThrownBy(() -> service.register("community-day", new EventRsvpRequest(
                "Alex Volunteer", "", 1, "Volunteer — Check-in host", "VOLUNTEER", "en")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email is required");
    }

    private Event volunteerEvent() {
        return Event.builder()
                .id(UUID.randomUUID())
                .slug("community-day")
                .status("PUBLISHED")
                .startAt(OffsetDateTime.now().plusDays(1))
                .enableVolunteer(true)
                .enableRsvp(true)
                .translations(Map.of("en", Map.of("roles", List.of("Check-in host"))))
                .build();
    }
}
