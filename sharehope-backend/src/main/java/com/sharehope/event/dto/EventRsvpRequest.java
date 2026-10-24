package com.sharehope.event.dto;

import jakarta.validation.constraints.*;

public record EventRsvpRequest(
        @NotBlank @Size(max = 160) String fullName,
        @Email @Size(max = 320) String email,
        @NotNull @Min(1) @Max(10) Integer guestCount,
        @NotBlank @Size(max = 80) String passType,
        @Pattern(regexp = "RSVP|VOLUNTEER") String registrationType,
        @Pattern(regexp = "en|fr") String locale
) {}
