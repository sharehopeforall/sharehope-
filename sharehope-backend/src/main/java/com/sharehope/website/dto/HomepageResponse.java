package com.sharehope.website.dto;

import java.util.List;

public record HomepageResponse(
    String name,
    String slug,
    String locale,
    List<HomepageSectionResponse> sections
) {}
