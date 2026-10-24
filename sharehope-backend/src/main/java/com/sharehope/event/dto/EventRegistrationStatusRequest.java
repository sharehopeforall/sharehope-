package com.sharehope.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record EventRegistrationStatusRequest(
        @NotBlank @Pattern(regexp = "CONFIRMED|CHECKED_IN|CANCELLED") String status
) {}
