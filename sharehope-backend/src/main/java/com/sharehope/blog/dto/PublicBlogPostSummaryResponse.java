package com.sharehope.blog.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record PublicBlogPostSummaryResponse(
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
        String imageAlt,
        String buttonText,
        String authorName,
        List<String> tags,
        OffsetDateTime publishedAt,
        int readingTimeMinutes
) {}
