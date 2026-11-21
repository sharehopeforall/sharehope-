package com.sharehope.event.repository;

import com.sharehope.event.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.UUID;
import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID> {
    boolean existsByEventIdAndEmailIgnoreCase(UUID eventId, String email);
    Optional<EventRegistration> findByEventIdAndEmailIgnoreCase(UUID eventId, String email);
    Optional<EventRegistration> findByConfirmationTokenHash(String tokenHash);

    @Query("select coalesce(sum(r.guestCount), 0) from EventRegistration r where r.event.id = :eventId and r.status in ('CONFIRMED', 'CHECKED_IN')")
    long reservedSeats(@Param("eventId") UUID eventId);

    List<EventRegistration> findByEventIdOrderByCreatedAtDesc(UUID eventId);

    @EntityGraph(attributePaths = "event")
    List<EventRegistration> findTop6ByOrderByCreatedAtDesc();

    @Query("select count(r) from EventRegistration r where r.registrationType = 'VOLUNTEER' and r.status in ('CONFIRMED', 'CHECKED_IN') and r.event.status = 'PUBLISHED' and r.event.startAt >= :now")
    long countUpcomingVolunteers(@Param("now") java.time.OffsetDateTime now);
}
