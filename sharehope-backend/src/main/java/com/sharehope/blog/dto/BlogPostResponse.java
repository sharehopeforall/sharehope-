package com.sharehope.blog.dto;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

public record BlogPostResponse(
        UUID id,
        String slug,
        String category,
        String format,
        String status,
        boolean featured,
        int displayOrder,
        String coverImageUrl,
        String videoUrl,
        Integer durationSeconds,
        String relatedProgramSlug,
        Map<String, Object> en,
        Map<String, Object> fr,
        OffsetDateTime publishedAt,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
