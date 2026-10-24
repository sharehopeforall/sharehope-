package com.sharehope.website.controller;

import com.sharehope.website.dto.HomepageResponse;
import com.sharehope.website.service.HomepageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/website")
@RequiredArgsConstructor
public class PublicHomepageController {

    private final HomepageService homepageService;

    @GetMapping("/homepage")
    public HomepageResponse getHomepage(
        @RequestParam(defaultValue = "en")
        String locale
    ) {
        return homepageService
            .getPublicHomepage(locale);
    }
}
