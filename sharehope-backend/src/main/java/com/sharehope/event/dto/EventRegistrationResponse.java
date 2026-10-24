package com.sharehope.event.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record EventRegistrationResponse(
        UUID id,
        String fullName,
        String email,
        Integer guestCount,
        String passType,
        String registrationType,
        String locale,
        String status,
        OffsetDateTime checkedInAt,
        OffsetDateTime createdAt
) {}
