package com.sharehope.website.controller;

import com.sharehope.website.dto.HomepageResponse;
import com.sharehope.website.dto.HomepageSectionResponse;
import com.sharehope.website.dto.UpdateHomepageSectionRequest;
import com.sharehope.website.service.SitePageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/website/pages")
@RequiredArgsConstructor
public class AdminSitePageController {
    private final SitePageService service;

    @GetMapping("/{pageKey}")
    public HomepageResponse get(@PathVariable String pageKey, @RequestParam(defaultValue = "en") String locale) {
        return service.getPage(pageKey, locale, false);
    }

    @PutMapping("/{pageKey}")
    public HomepageSectionResponse update(@PathVariable String pageKey, @Valid @RequestBody UpdateHomepageSectionRequest request) {
        return service.updateContent(pageKey, request);
    }
}
