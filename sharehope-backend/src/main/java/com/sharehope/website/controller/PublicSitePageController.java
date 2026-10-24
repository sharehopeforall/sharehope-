package com.sharehope.website.controller;

import com.sharehope.website.dto.HomepageResponse;
import com.sharehope.website.service.SitePageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/website/pages")
@RequiredArgsConstructor
public class PublicSitePageController {
    private final SitePageService service;

    @GetMapping("/{pageKey}")
    public HomepageResponse get(@PathVariable String pageKey, @RequestParam(defaultValue = "en") String locale) {
        return service.getPage(pageKey, locale, true);
    }
}
