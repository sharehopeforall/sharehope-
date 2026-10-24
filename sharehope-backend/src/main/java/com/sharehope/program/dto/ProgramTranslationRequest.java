package com.sharehope.program.dto;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
public record ProgramTranslationRequest(@NotBlank String title, @NotBlank String description, String buttonText, String imageAlt, List<@NotBlank String> initiatives) {}
