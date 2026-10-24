package com.sharehope.blog.service;

import com.sharehope.blog.dto.BlogSettingsRequest;
import com.sharehope.blog.model.BlogSettings;
import com.sharehope.blog.repository.BlogSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service @RequiredArgsConstructor
public class BlogSettingsService {
    private final BlogSettingsRepository repository;

    @Transactional(readOnly = true)
    public Map<String, Object> get(String locale) {
        if (!"en".equals(locale) && !"fr".equals(locale)) throw new IllegalArgumentException("Unsupported locale.");
        BlogSettings settings = repository.findById(1).orElseThrow(() -> new IllegalStateException("Blog settings are unavailable."));
        Object value = settings.getTranslations().get(locale);
        if (!(value instanceof Map<?, ?>)) value = settings.getTranslations().get("en");
        return value instanceof Map<?, ?> map ? map.entrySet().stream().collect(LinkedHashMap::new, (result, entry) -> result.put(String.valueOf(entry.getKey()), entry.getValue()), Map::putAll) : Map.of();
    }

    @Transactional
    public Map<String, Object> update(BlogSettingsRequest request) {
        BlogSettings settings = repository.findById(1).orElseGet(BlogSettings::new);
        settings.setId(1);
        Map<String, Object> translations = new LinkedHashMap<>(settings.getTranslations());
        translations.put("en", map(request));
        settings.setTranslations(translations);
        repository.save(settings);
        return map(request);
    }

    private Map<String, Object> map(BlogSettingsRequest request) {
        Map<String, Object> value = new LinkedHashMap<>();
        value.put("eyebrow", request.eyebrow()); value.put("title", request.title()); value.put("lead", request.lead());
        value.put("featuredLabel", request.featuredLabel()); value.put("newsletterTitle", request.newsletterTitle());
        value.put("newsletterBody", request.newsletterBody()); value.put("newsletterCta", request.newsletterCta()); value.put("emptyState", request.emptyState());
        return value;
    }
}
