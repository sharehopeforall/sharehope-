package com.sharehope.website.service;

import com.sharehope.website.dto.VisualPageContentResponse;
import com.sharehope.website.model.VisualPageContent;
import com.sharehope.website.repository.VisualPageContentRepository;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class VisualPageContentService {
    private final VisualPageContentRepository repository;

    @Transactional(readOnly = true)
    public VisualPageContentResponse getAdmin(String path, String locale) {
        validate(path, locale);
        return repository.findByPagePathAndLocale(path, locale).map(this::response).orElse(new VisualPageContentResponse(path, locale, Map.of(), Map.of(), null, null));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublished(String path, String locale) {
        validate(path, locale);
        return repository.findByPagePathAndLocale(path, locale).map(VisualPageContent::getPublishedContent).orElse(Map.of());
    }

    @Transactional
    public VisualPageContentResponse saveDraft(String path, String locale, Map<String, Object> content) {
        validate(path, locale);
        VisualPageContent page = repository.findByPagePathAndLocale(path, locale).orElseGet(() -> VisualPageContent.builder().id(UUID.randomUUID()).pagePath(path).locale(locale).draftContent(new HashMap<>()).publishedContent(new HashMap<>()).updatedAt(OffsetDateTime.now()).build());
        page.setDraftContent(new HashMap<>(content));
        return response(repository.save(page));
    }

    @Transactional
    public VisualPageContentResponse publish(String path, String locale) {
        validate(path, locale);
        VisualPageContent page = repository.findByPagePathAndLocale(path, locale).orElseGet(() -> VisualPageContent.builder().id(UUID.randomUUID()).pagePath(path).locale(locale).draftContent(new HashMap<>()).publishedContent(new HashMap<>()).updatedAt(OffsetDateTime.now()).build());
        page.setPublishedContent(new HashMap<>(page.getDraftContent()));
        page.setPublishedAt(OffsetDateTime.now());
        return response(repository.save(page));
    }

    @Transactional
    public VisualPageContentResponse discard(String path, String locale) {
        validate(path, locale);
        VisualPageContent page = repository.findByPagePathAndLocale(path, locale).orElseGet(() -> VisualPageContent.builder().id(UUID.randomUUID()).pagePath(path).locale(locale).draftContent(new HashMap<>()).publishedContent(new HashMap<>()).updatedAt(OffsetDateTime.now()).build());
        page.setDraftContent(new HashMap<>(page.getPublishedContent()));
        return response(repository.save(page));
    }

    private VisualPageContentResponse response(VisualPageContent page) { return new VisualPageContentResponse(page.getPagePath(), page.getLocale(), page.getDraftContent(), page.getPublishedContent(), page.getUpdatedAt(), page.getPublishedAt()); }
    private void validate(String path, String locale) {
        if (path == null || !path.startsWith("/") || path.contains("..") || path.length() > 255) throw new IllegalArgumentException("Invalid page path.");
        if (!"en".equals(locale) && !"fr".equals(locale)) throw new IllegalArgumentException("Unsupported locale.");
    }
}
