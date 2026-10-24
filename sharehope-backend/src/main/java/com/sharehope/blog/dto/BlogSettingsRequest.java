package com.sharehope.blog.dto;

import jakarta.validation.constraints.NotBlank;

public record BlogSettingsRequest(
        @NotBlank String eyebrow,
        @NotBlank String title,
        @NotBlank String lead,
        @NotBlank String featuredLabel,
        @NotBlank String newsletterTitle,
        @NotBlank String newsletterBody,
        @NotBlank String newsletterCta,
        @NotBlank String emptyState
) {}
