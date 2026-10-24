package com.sharehope.program.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
public record ProgramRequest(@NotBlank @Pattern(regexp="[a-z0-9]+(?:-[a-z0-9]+)*") String slug, @NotBlank String category, Integer displayOrder, boolean published, boolean featured, String imageUrl, @NotNull @Valid ProgramTranslationRequest en, @Valid ProgramTranslationRequest fr) {}
