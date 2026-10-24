package com.sharehope.blog.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record BlogPostRequest(
        @NotBlank
        @Pattern(regexp = "[a-z0-9]+(?:-[a-z0-9]+)*", message = "must be a lowercase URL slug")
        String slug,
        @NotBlank String category,
        @NotBlank @Pattern(regexp = "ARTICLE|VIDEO") String format,
        @NotBlank @Pattern(regexp = "DRAFT|PUBLISHED") String status,
        boolean featured,
        Integer displayOrder,
        String coverImageUrl,
        String videoUrl,
        @Positive Integer durationSeconds,
        String relatedProgramSlug,
        @NotNull @Valid BlogPostTranslationRequest en,
        @Valid BlogPostTranslationRequest fr
) {}
