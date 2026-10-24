package com.sharehope.website.dto;

import java.time.OffsetDateTime;
import java.util.Map;

public record VisualPageContentResponse(String pagePath, String locale, Map<String, Object> draftContent, Map<String, Object> publishedContent, OffsetDateTime updatedAt, OffsetDateTime publishedAt) {}
