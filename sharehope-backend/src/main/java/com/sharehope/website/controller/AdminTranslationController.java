package com.sharehope.website.controller;

import com.sharehope.website.dto.TranslateContentRequest;
import com.sharehope.website.dto.TranslateContentResponse;
import com.sharehope.website.service.TranslationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/website/translate")
@RequiredArgsConstructor
public class AdminTranslationController {

    private final TranslationService translationService;

    @PostMapping
    public TranslateContentResponse translate(@Valid @RequestBody TranslateContentRequest request) {
        return translationService.translateEnglishToFrench(request.fields());
    }
}
