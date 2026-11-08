package com.sharehope.event.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
public record EventTranslationRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 500) String excerpt,
        @NotBlank @Size(max = 10000) String description,
        @Size(max = 80) String buttonText,
        @Size(max = 300) String imageAlt,
        @Size(max = 120) String metaTag,
        @Size(max = 100) List<@Size(max = 500) String> agenda,
        @Size(max = 50) List<@Size(max = 120) String> roles) {}
