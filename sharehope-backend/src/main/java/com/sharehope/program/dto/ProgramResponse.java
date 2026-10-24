package com.sharehope.program.dto;
import java.time.OffsetDateTime;
import java.util.*;
public record ProgramResponse(UUID id, String slug, String category, Integer displayOrder, Boolean published, Boolean featured, String imageUrl, Map<String,Object> en, Map<String,Object> fr, OffsetDateTime createdAt, OffsetDateTime updatedAt) {}
