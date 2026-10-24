package com.sharehope.blog.controller;

import com.sharehope.blog.dto.PublicBlogPostResponse;
import com.sharehope.blog.dto.PublicBlogPostSummaryResponse;
import com.sharehope.blog.service.BlogPostService;
import com.sharehope.blog.service.BlogSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/blog")
@RequiredArgsConstructor
public class PublicBlogPostController {
    private final BlogPostService service;
    private final BlogSettingsService settingsService;

    @GetMapping("/settings")
    public Map<String, Object> settings(@RequestParam(defaultValue = "en") String locale) {
        return settingsService.get(locale);
    }

    @GetMapping
    public List<PublicBlogPostSummaryResponse> list(
            @RequestParam(defaultValue = "en") String locale,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean featured
    ) {
        return service.publicList(locale, category, featured);
    }

    @GetMapping("/categories")
    public List<String> categories() {
        return service.publicCategories();
    }

    @GetMapping("/{slug}")
    public PublicBlogPostResponse get(
            @PathVariable String slug,
            @RequestParam(defaultValue = "en") String locale
    ) {
        return service.publicGet(slug, locale);
    }
}
