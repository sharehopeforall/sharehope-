package com.sharehope.program.dto;
import java.util.*;
public record PublicProgramResponse(UUID id, String slug, String category, Integer displayOrder, Boolean featured, String imageUrl, String title, String description, String buttonText, String imageAlt, List<String> initiatives) {}
