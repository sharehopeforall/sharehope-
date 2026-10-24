package com.sharehope.event.repository;

import com.sharehope.event.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;
import java.util.List;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID> {
    boolean existsByEventIdAndEmailIgnoreCase(UUID eventId, String email);

    @Query("select coalesce(sum(r.guestCount), 0) from EventRegistration r where r.event.id = :eventId and r.status <> 'CANCELLED'")
    long reservedSeats(@Param("eventId") UUID eventId);

    List<EventRegistration> findByEventIdOrderByCreatedAtDesc(UUID eventId);
}
