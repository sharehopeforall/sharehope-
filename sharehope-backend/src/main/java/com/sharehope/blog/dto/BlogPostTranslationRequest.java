package com.sharehope.blog.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record BlogPostTranslationRequest(
        @NotBlank String title,
        @NotBlank String excerpt,
        @NotBlank String body,
        String imageAlt,
        String buttonText,
        String authorName,
        String seoTitle,
        String seoDescription,
        List<@NotBlank String> tags
) {}
