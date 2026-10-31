package com.sharehope.website.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.sharehope.website.model.VisualPageContent;
import com.sharehope.website.repository.VisualPageContentRepository;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class VisualPageContentServiceTest {
    private final VisualPageContentRepository repository = mock(VisualPageContentRepository.class);
    private final TranslationService translation = mock(TranslationService.class);
    private final VisualPageContentService service = new VisualPageContentService(repository, translation);

    @Test
    void rejectsUnsafeMediaUrls() {
        Map<String, Object> patch = Map.of(
                "selector", "[data-visual-key=hero]",
                "type", "image",
                "value", "javascript:alert(1)"
        );
        assertThrows(
                IllegalArgumentException.class,
                () -> service.saveDraft("/", "en", Map.of("hero::image", patch), 0L)
        );
    }

    @Test
    void rejectsStaleEditorVersion() {
        VisualPageContent page = VisualPageContent.builder()
                .id(UUID.randomUUID())
                .pagePath("/")
                .locale("en")
                .draftContent(new HashMap<>())
                .publishedContent(new HashMap<>())
                .updatedAt(OffsetDateTime.now())
                .version(3L)
                .build();
        when(repository.findByPagePathAndLocale("/", "en")).thenReturn(Optional.of(page));
        Map<String, Object> patch = Map.of(
                "selector", "[data-visual-key=title]",
                "type", "text",
                "value", "Updated title"
        );

        ResponseStatusException error = assertThrows(
                ResponseStatusException.class,
                () -> service.saveDraft("/", "en", Map.of("title::text", patch), 2L)
        );
        assertEquals(409, error.getStatusCode().value());
    }
}
