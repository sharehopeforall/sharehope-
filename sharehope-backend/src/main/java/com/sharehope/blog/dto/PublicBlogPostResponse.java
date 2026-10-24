package com.sharehope.blog.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record PublicBlogPostResponse(
        UUID id,
        String slug,
        String category,
        String format,
        boolean featured,
        String coverImageUrl,
        String videoUrl,
        Integer durationSeconds,
        String relatedProgramSlug,
        String title,
        String excerpt,
        String body,
        String imageAlt,
        String buttonText,
        String authorName,
        String seoTitle,
        String seoDescription,
        List<String> tags,
        OffsetDateTime publishedAt,
        int readingTimeMinutes
) {}
