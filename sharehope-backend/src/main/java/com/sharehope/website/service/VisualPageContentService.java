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
    private final TranslationService translationService;

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
        VisualPageContent page = page(path, locale);
        page.setDraftContent(new HashMap<>(content));
        repository.save(page);

        String targetLocale = opposite(locale);
        Map<String, Object> translated = translationService.translateContent(
                content,
                locale.toUpperCase(),
                targetLocale.toUpperCase()
        );
        VisualPageContent target = page(path, targetLocale);
        target.setDraftContent(new HashMap<>(translated));
        repository.save(target);
        return response(page);
    }

    @Transactional
    public VisualPageContentResponse publish(String path, String locale) {
        validate(path, locale);
        VisualPageContent page = page(path, locale);
        page.setPublishedContent(new HashMap<>(page.getDraftContent()));
        page.setPublishedAt(OffsetDateTime.now());
        repository.save(page);

        VisualPageContent target = page(path, opposite(locale));
        target.setPublishedContent(new HashMap<>(target.getDraftContent()));
        target.setPublishedAt(OffsetDateTime.now());
        repository.save(target);
        return response(page);
    }

    @Transactional
    public VisualPageContentResponse discard(String path, String locale) {
        validate(path, locale);
        VisualPageContent page = page(path, locale);
        page.setDraftContent(new HashMap<>(page.getPublishedContent()));
        repository.save(page);
        VisualPageContent target = page(path, opposite(locale));
        target.setDraftContent(new HashMap<>(target.getPublishedContent()));
        repository.save(target);
        return response(page);
    }

    private VisualPageContent page(String path, String locale) {
        return repository.findByPagePathAndLocale(path, locale).orElseGet(() ->
                VisualPageContent.builder()
                        .id(UUID.randomUUID())
                        .pagePath(path)
                        .locale(locale)
                        .draftContent(new HashMap<>())
                        .publishedContent(new HashMap<>())
                        .updatedAt(OffsetDateTime.now())
                        .build()
        );
    }

    private String opposite(String locale) { return "en".equals(locale) ? "fr" : "en"; }
    private VisualPageContentResponse response(VisualPageContent page) { return new VisualPageContentResponse(page.getPagePath(), page.getLocale(), page.getDraftContent(), page.getPublishedContent(), page.getUpdatedAt(), page.getPublishedAt()); }
    private void validate(String path, String locale) {
        if (path == null || !path.startsWith("/") || path.contains("..") || path.length() > 255) throw new IllegalArgumentException("Invalid page path.");
        if (!"en".equals(locale) && !"fr".equals(locale)) throw new IllegalArgumentException("Unsupported locale.");
    }
}
