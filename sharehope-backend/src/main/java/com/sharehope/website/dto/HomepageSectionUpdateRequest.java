package com.sharehope.website.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record HomepageSectionUpdateRequest(
    @NotBlank String sectionKey,
    @NotNull @Valid UpdateHomepageSectionRequest data
) {}
