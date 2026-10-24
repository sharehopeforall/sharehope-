package com.sharehope.blog.controller;

import com.sharehope.blog.dto.BlogPostRequest;
import com.sharehope.blog.dto.BlogPostResponse;
import com.sharehope.blog.dto.BlogSettingsRequest;
import com.sharehope.blog.service.BlogPostService;
import com.sharehope.blog.service.BlogSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/blog")
@RequiredArgsConstructor
public class AdminBlogPostController {
    private final BlogPostService service;
    private final BlogSettingsService settingsService;

    @GetMapping("/settings")
    public Map<String, Object> settings() {
        return settingsService.get("en");
    }

    @PutMapping("/settings")
    public Map<String, Object> updateSettings(@Valid @RequestBody BlogSettingsRequest request) {
        return settingsService.update(request);
    }

    @GetMapping
    public List<BlogPostResponse> list() {
        return service.adminList();
    }

    @GetMapping("/{id}")
    public BlogPostResponse get(@PathVariable UUID id) {
        return service.adminGet(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BlogPostResponse create(@Valid @RequestBody BlogPostRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public BlogPostResponse update(@PathVariable UUID id, @Valid @RequestBody BlogPostRequest request) {
        return service.update(id, request);
    }

    @PostMapping("/{id}/publish")
    public BlogPostResponse publish(@PathVariable UUID id) {
        return service.publish(id);
    }

    @PostMapping("/{id}/unpublish")
    public BlogPostResponse unpublish(@PathVariable UUID id) {
        return service.unpublish(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
