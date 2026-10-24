package com.sharehope.website.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record VisualPageContentRequest(@NotNull Map<String, Object> content) {}
