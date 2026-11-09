package com.sharehope.website.service;

import com.sharehope.website.model.VisualPageContent;
import com.sharehope.website.repository.VisualPageContentRepository;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VisualPageDraftTranslationService {
    private static final Logger log = LoggerFactory.getLogger(VisualPageDraftTranslationService.class);
    private final VisualPageContentRepository repository;
    private final TranslationService translationService;

    @Async
    @Transactional
    public void translate(String path, String sourceLocale, Map<String, Object> content, Long expectedTargetVersion) {
        String targetLocale = "en".equals(sourceLocale) ? "fr" : "en";
        try {
            Map<String, Object> translated = translationService.translateContent(
                    content,
                    sourceLocale.toUpperCase(),
                    targetLocale.toUpperCase()
            );
            VisualPageContent target = repository.findByPagePathAndLocale(path, targetLocale).orElse(null);
            if (target != null && !target.getVersion().equals(expectedTargetVersion)) {
                log.info("Skipped stale visual translation for {} ({}) because the target draft changed.", path, targetLocale);
                return;
            }
            if (target == null && expectedTargetVersion != null) {
                log.info("Skipped stale visual translation for {} ({}) because the target draft was replaced.", path, targetLocale);
                return;
            }
            if (target == null) {
                target = VisualPageContent.builder()
                            .id(UUID.randomUUID())
                            .pagePath(path)
                            .locale(targetLocale)
                            .draftContent(new HashMap<>())
                            .publishedContent(new HashMap<>())
                            .updatedAt(OffsetDateTime.now())
                            .build();
            }
            target.setDraftContent(new HashMap<>(translated));
            repository.saveAndFlush(target);
        } catch (RuntimeException exception) {
            log.warn("Saved visual draft for {} ({}) but automatic translation to {} failed: {}",
                    path, sourceLocale, targetLocale, exception.getMessage());
        }
    }
}
