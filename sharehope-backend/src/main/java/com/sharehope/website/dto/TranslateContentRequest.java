package com.sharehope.website.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.Map;

public record TranslateContentRequest(
        @NotEmpty Map<String, String> fields
) {}
