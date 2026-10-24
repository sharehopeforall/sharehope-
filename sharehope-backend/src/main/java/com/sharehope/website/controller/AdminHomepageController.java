package com.sharehope.website.controller;

import com.sharehope.website.dto.*;
import com.sharehope.website.service.HomepageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/website/homepage")
@RequiredArgsConstructor
public class AdminHomepageController {

    private final HomepageService homepageService;

    @GetMapping
    public HomepageResponse getHomepage(
        @RequestParam(defaultValue = "en")
        String locale
    ) {
        return homepageService
            .getAdminHomepage(locale);
    }

    @PutMapping("/sections/{sectionKey}")
    public HomepageSectionResponse updateSection(
        @PathVariable String sectionKey,

        @Valid
        @RequestBody
        UpdateHomepageSectionRequest request
    ) {
        return homepageService
            .updateSection(
                sectionKey,
                request
            );
    }

    @PutMapping
    public HomepageResponse updateHomepage(
        @Valid @RequestBody UpdateHomepageRequest request
    ) {
        return homepageService.updateSections(request);
    }
}
