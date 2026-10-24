package com.sharehope.website.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record UpdateHomepageSectionRequest(

    @NotNull
    Boolean enabled,

    Integer displayOrder,

    Map<String, Object> settings,

    @Valid
    SectionTranslationRequest en,

    @Valid
    SectionTranslationRequest fr
) {}
