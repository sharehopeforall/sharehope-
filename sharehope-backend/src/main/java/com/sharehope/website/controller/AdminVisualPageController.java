package com.sharehope.website.controller;

import com.sharehope.website.dto.VisualPageContentRequest;
import com.sharehope.website.dto.VisualPageContentResponse;
import com.sharehope.website.service.VisualPageContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/admin/website/visual-content") @RequiredArgsConstructor
public class AdminVisualPageController {
    private final VisualPageContentService service;
    @GetMapping public VisualPageContentResponse get(@RequestParam String path, @RequestParam(defaultValue = "en") String locale) { return service.getAdmin(path, locale); }
    @PutMapping("/draft") public VisualPageContentResponse saveDraft(@RequestParam String path, @RequestParam(defaultValue = "en") String locale, @Valid @RequestBody VisualPageContentRequest request) { return service.saveDraft(path, locale, request.content()); }
    @PostMapping("/publish") @PreAuthorize("hasRole('SUPER_ADMIN')") public VisualPageContentResponse publish(@RequestParam String path, @RequestParam(defaultValue = "en") String locale) { return service.publish(path, locale); }
    @PostMapping("/discard") public VisualPageContentResponse discard(@RequestParam String path, @RequestParam(defaultValue = "en") String locale) { return service.discard(path, locale); }
}
