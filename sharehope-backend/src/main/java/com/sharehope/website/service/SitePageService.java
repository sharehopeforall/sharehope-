package com.sharehope.website.service;

import com.sharehope.exception.ResourceNotFoundException;
import com.sharehope.website.dto.HomepageResponse;
import com.sharehope.website.dto.HomepageSectionResponse;
import com.sharehope.website.dto.SectionTranslationRequest;
import com.sharehope.website.dto.UpdateHomepageSectionRequest;
import com.sharehope.website.model.Page;
import com.sharehope.website.model.PageSection;
import com.sharehope.website.model.PageSectionTranslation;
import com.sharehope.website.model.PageStatus;
import com.sharehope.website.repository.PageRepository;
import com.sharehope.website.repository.PageSectionRepository;
import com.sharehope.website.repository.PageSectionTranslationRepository;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SitePageService {
    private static final Map<String, String> PAGE_SLUGS = Map.ofEntries(
        Map.entry("about", "/about"),
        Map.entry("our-story", "/about/our-story"),
        Map.entry("founder", "/about/founder"),
        Map.entry("team", "/about/team"),
        Map.entry("donate", "/donate"),
        Map.entry("volunteer", "/volunteer"),
        Map.entry("partner", "/partner"),
        Map.entry("privacy", "/privacy"),
        Map.entry("navigation-footer", "/_navigation-footer"),
        Map.entry("seo-social", "/_seo-social")
    );

    private final PageRepository pageRepository;
    private final PageSectionRepository sectionRepository;
    private final PageSectionTranslationRepository translationRepository;

    @Transactional(readOnly = true)
    public HomepageResponse getPage(String pageKey, String locale, boolean publicOnly) {
        validateLocale(locale);
        String slug = resolveSlug(pageKey);
        Page page = publicOnly
            ? pageRepository.findBySlugAndStatus(slug, PageStatus.PUBLISHED).orElseThrow(() -> new ResourceNotFoundException("Page not found."))
            : pageRepository.findBySlug(slug).orElseThrow(() -> new ResourceNotFoundException("Page not found."));
        List<PageSection> sections = publicOnly
            ? sectionRepository.findByPageIdAndEnabledTrueOrderByDisplayOrderAsc(page.getId())
            : sectionRepository.findByPageIdOrderByDisplayOrderAsc(page.getId());
        return new HomepageResponse(page.getName(), page.getSlug(), locale, sections.stream().map(section -> toResponse(section, locale)).toList());
    }

    @Transactional
    public HomepageSectionResponse updateContent(String pageKey, UpdateHomepageSectionRequest request) {
        Page page = pageRepository.findBySlug(resolveSlug(pageKey)).orElseThrow(() -> new ResourceNotFoundException("Page not found."));
        PageSection section = sectionRepository.findByPageIdAndSectionKey(page.getId(), "content").orElseThrow(() -> new ResourceNotFoundException("Page content not found."));
        section.setEnabled(request.enabled());
        if (request.settings() != null) {
            Map<String, Object> settings = new HashMap<>(section.getSettings());
            settings.putAll(request.settings());
            section.setSettings(settings);
        }
        sectionRepository.save(section);
        updateTranslation(section, "en", request.en());
        updateTranslation(section, "fr", request.fr());
        return toResponse(section, "en");
    }

    private void updateTranslation(PageSection section, String locale, SectionTranslationRequest request) {
        if (request == null) return;
        PageSectionTranslation translation = translationRepository.findByPageSectionIdAndLocale(section.getId(), locale).orElseGet(() -> PageSectionTranslation.builder().id(UUID.randomUUID()).pageSection(section).locale(locale).createdAt(OffsetDateTime.now()).updatedAt(OffsetDateTime.now()).build());
        translation.setTitle(request.title());
        translation.setSubtitle(request.subtitle());
        translation.setBody(request.body());
        translation.setButtonText(request.buttonText());
        translationRepository.save(translation);
    }

    private HomepageSectionResponse toResponse(PageSection section, String locale) {
        PageSectionTranslation translation = translationRepository.findByPageSectionIdAndLocale(section.getId(), locale).orElse(null);
        return new HomepageSectionResponse(section.getSectionKey(), section.getSectionType().name(), section.getDisplayOrder(), section.getEnabled(), translation == null ? null : translation.getTitle(), translation == null ? null : translation.getSubtitle(), translation == null ? null : translation.getBody(), translation == null ? null : translation.getButtonText(), section.getSettings());
    }

    private String resolveSlug(String pageKey) {
        String slug = PAGE_SLUGS.get(pageKey);
        if (slug == null) throw new IllegalArgumentException("Unsupported website page.");
        return slug;
    }

    private void validateLocale(String locale) {
        if (!"en".equalsIgnoreCase(locale) && !"fr".equalsIgnoreCase(locale)) throw new IllegalArgumentException("Unsupported locale.");
    }
}
