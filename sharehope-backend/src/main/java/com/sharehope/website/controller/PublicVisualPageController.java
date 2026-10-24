package com.sharehope.website.controller;

import com.sharehope.website.service.VisualPageContentService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/public/website/visual-content") @RequiredArgsConstructor
public class PublicVisualPageController {
    private final VisualPageContentService service;
    @GetMapping public Map<String, Object> get(@RequestParam String path, @RequestParam(defaultValue = "en") String locale) { return service.getPublished(path, locale); }
}
