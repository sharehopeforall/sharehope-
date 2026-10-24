package com.sharehope.newsletter.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record NewsletterSubscribeRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        String email,

        @Size(max = 100, message = "First name must be 100 characters or fewer")
        String firstName,

        @Size(max = 100, message = "Last name must be 100 characters or fewer")
        String lastName,

        @Pattern(regexp = "en|fr", message = "Locale must be en or fr")
        String locale
) {}
