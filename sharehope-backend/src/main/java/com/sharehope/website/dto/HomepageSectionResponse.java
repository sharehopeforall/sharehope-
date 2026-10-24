package com.sharehope.website.dto;

import java.util.Map;

public record HomepageSectionResponse(
    String key,
    String type,
    Integer displayOrder,
    Boolean enabled,
    String title,
    String subtitle,
    String body,
    String buttonText,
    Map<String, Object> settings
) {}
