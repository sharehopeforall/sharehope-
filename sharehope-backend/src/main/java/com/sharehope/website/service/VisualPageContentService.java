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
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service @RequiredArgsConstructor
public class VisualPageContentService {
    private static final Logger log = LoggerFactory.getLogger(VisualPageContentService.class);
    private final VisualPageContentRepository repository;
    private final TranslationService translationService;

    @Transactional(readOnly = true)
    public VisualPageContentResponse getAdmin(String path, String locale) {
        validate(path, locale);
        return repository.findByPagePathAndLocale(path, locale).map(this::response).orElse(new VisualPageContentResponse(path, locale, Map.of(), Map.of(), null, null, 0L, null));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublished(String path, String locale) {
        validate(path, locale);
        return repository.findByPagePathAndLocale(path, locale).map(VisualPageContent::getPublishedContent).orElse(Map.of());
    }

    @Transactional
    public VisualPageContentResponse saveDraft(String path, String locale, Map<String, Object> content, Long expectedVersion) {
        validate(path, locale);
        validateContent(content);
        VisualPageContent page = page(path, locale);
        if (expectedVersion != null && !expectedVersion.equals(page.getVersion())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This page was changed by another editor. Reload before saving.");
        }
        page.setDraftContent(new HashMap<>(content));
        repository.save(page);

        String targetLocale = opposite(locale);
        boolean translationSucceeded = false;
        try {
            Map<String, Object> translated = translationService.translateContent(
                    content,
                    locale.toUpperCase(),
                    targetLocale.toUpperCase()
            );
            VisualPageContent target = page(path, targetLocale);
            target.setDraftContent(new HashMap<>(translated));
            repository.save(target);
            translationSucceeded = true;
        } catch (RuntimeException exception) {
            // The editor's source-language work is authoritative. A temporary
            // translation-provider failure must never roll back or erase it.
            log.warn("Saved visual draft for {} ({}) but automatic translation to {} failed: {}",
                    path, locale, targetLocale, exception.getMessage());
        }
        repository.flush();
        return response(page, translationSucceeded);
    }

    @Transactional
    public VisualPageContentResponse publish(String path, String locale, Long expectedVersion) {
        validate(path, locale);
        VisualPageContent page = page(path, locale);
        requireVersion(page, expectedVersion);
        page.setPublishedContent(new HashMap<>(page.getDraftContent()));
        page.setPublishedAt(OffsetDateTime.now());
        repository.save(page);

        VisualPageContent target = page(path, opposite(locale));
        target.setPublishedContent(new HashMap<>(target.getDraftContent()));
        target.setPublishedAt(OffsetDateTime.now());
        repository.save(target);
        repository.flush();
        return response(page);
    }

    @Transactional
    public VisualPageContentResponse discard(String path, String locale, Long expectedVersion) {
        validate(path, locale);
        VisualPageContent page = page(path, locale);
        requireVersion(page, expectedVersion);
        page.setDraftContent(new HashMap<>(page.getPublishedContent()));
        repository.save(page);
        VisualPageContent target = page(path, opposite(locale));
        target.setDraftContent(new HashMap<>(target.getPublishedContent()));
        repository.save(target);
        repository.flush();
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
    private void requireVersion(VisualPageContent page, Long expectedVersion) {
        if (expectedVersion != null && !expectedVersion.equals(page.getVersion())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This page was changed by another editor. Reload before continuing.");
        }
    }
    private VisualPageContentResponse response(VisualPageContent page) { return response(page, null); }
    private VisualPageContentResponse response(VisualPageContent page, Boolean translationSucceeded) { return new VisualPageContentResponse(page.getPagePath(), page.getLocale(), page.getDraftContent(), page.getPublishedContent(), page.getUpdatedAt(), page.getPublishedAt(), page.getVersion(), translationSucceeded); }
    private void validate(String path, String locale) {
        if (path == null || !path.startsWith("/") || path.contains("..") || path.length() > 255) throw new IllegalArgumentException("Invalid page path.");
        if (!"en".equals(locale) && !"fr".equals(locale)) throw new IllegalArgumentException("Unsupported locale.");
    }

    private void validateContent(Map<String, Object> content) {
        if (content.size() > 1_000) throw new IllegalArgumentException("A page cannot contain more than 1,000 visual edits.");
        long totalCharacters = 0;
        for (Map.Entry<String, Object> entry : content.entrySet()) {
            if (entry.getKey() == null || entry.getKey().length() > 1_200) throw new IllegalArgumentException("Invalid visual edit key.");
            if (!(entry.getValue() instanceof Map<?, ?> patch)) throw new IllegalArgumentException("Invalid visual edit.");
            String selector = string(patch.get("selector"));
            String type = string(patch.get("type"));
            String value = string(patch.get("value"));
            if (selector == null || selector.isBlank() || selector.length() > 1_000) throw new IllegalArgumentException("Invalid visual selector.");
            if (!java.util.Set.of("text", "image", "video", "link", "background").contains(type)) throw new IllegalArgumentException("Invalid visual edit type.");
            if (value == null) throw new IllegalArgumentException("A visual edit value is required.");
            int maximum = "text".equals(type) ? 20_000 : 2_048;
            if (value.length() > maximum) throw new IllegalArgumentException("Visual edit value is too long.");
            if (!"text".equals(type) && !value.isBlank() && !safeResource(value, type)) throw new IllegalArgumentException("Invalid visual resource URL.");
            totalCharacters += selector.length() + value.length();
        }
        if (totalCharacters > 1_000_000) throw new IllegalArgumentException("Visual page content is too large.");
    }

    private boolean safeResource(String value, String type) {
        if ("link".equals(type)) return value.matches("^(https://|/|#|mailto:|tel:).*");
        return value.matches("^(https://|/).*");
    }

    private String string(Object value) { return value == null ? null : String.valueOf(value); }
}
