package com.sharehope.event.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.OffsetDateTime;

public record EventRequest(
        @NotBlank @Size(max = 120) @Pattern(regexp="[a-z0-9]+(?:-[a-z0-9]+)*") String slug,
        @NotBlank @Pattern(regexp = "in-person|virtual|hybrid") String category,
        @NotNull OffsetDateTime startAt,
        OffsetDateTime endAt,
        @NotBlank @Size(max = 80) String timezone,
        @Size(max = 500) String location,
        @Size(max = 2000) @Pattern(regexp = "^$|https://.+", message = "must be a secure HTTPS URL") String virtualUrl,
        @Size(max = 2000) String imageUrl,
        @Min(0) Integer displayOrder,
        @NotBlank @Pattern(regexp = "DRAFT|PUBLISHED|CANCELLED|ARCHIVED") String status,
        boolean featured,
        boolean highlighted,
        @Min(1) Integer capacity,
        boolean enableRsvp,
        boolean enableDonate,
        boolean enableVolunteer,
        @NotNull @Valid EventTranslationRequest en,
        @Valid EventTranslationRequest fr) {}
