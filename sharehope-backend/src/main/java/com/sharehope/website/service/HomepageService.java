package com.sharehope.website.service;

import com.sharehope.exception.ResourceNotFoundException;
import com.sharehope.website.dto.*;
import com.sharehope.website.model.*;
import com.sharehope.website.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class HomepageService {

    private final PageRepository pageRepository;
    private final PageSectionRepository pageSectionRepository;
    private final PageSectionTranslationRepository translationRepository;

    @Transactional(readOnly = true)
    public HomepageResponse getPublicHomepage(String locale) {

        validateLocale(locale);

        Page page = pageRepository
            .findBySlugAndStatus("/", PageStatus.PUBLISHED)
            .orElseThrow(() ->
                new ResourceNotFoundException("Homepage not found.")
            );

        List<PageSection> sections =
            pageSectionRepository
                .findByPageIdAndEnabledTrueOrderByDisplayOrderAsc(
                    page.getId()
                );

        List<HomepageSectionResponse> responses =
            sections.stream()
                .map(section -> toResponse(section, locale))
                .toList();

        return new HomepageResponse(
            page.getName(),
            page.getSlug(),
            locale,
            responses
        );
    }

    @Transactional(readOnly = true)
    public HomepageResponse getAdminHomepage(String locale) {

        validateLocale(locale);

        Page page = getHomepage();

        List<PageSection> sections =
            pageSectionRepository
                .findByPageIdOrderByDisplayOrderAsc(
                    page.getId()
                );

        List<HomepageSectionResponse> responses =
            sections.stream()
                .map(section -> toResponse(section, locale))
                .toList();

        return new HomepageResponse(
            page.getName(),
            page.getSlug(),
            locale,
            responses
        );
    }

    @Transactional
    public HomepageSectionResponse updateSection(
        String sectionKey,
        UpdateHomepageSectionRequest request
    ) {

        Page page = getHomepage();

        PageSection section =
            pageSectionRepository
                .findByPageIdAndSectionKey(
                    page.getId(),
                    sectionKey
                )
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Homepage section not found."
                    )
                );

        section.setEnabled(request.enabled());

        if (request.displayOrder() != null) {
            section.setDisplayOrder(
                request.displayOrder()
            );
        }

        if (request.settings() != null) {
            Map<String, Object> mergedSettings = new HashMap<>();
            if (section.getSettings() != null) {
                mergedSettings.putAll(section.getSettings());
            }
            mergedSettings.putAll(request.settings());
            section.setSettings(mergedSettings);
        }

        section.setUpdatedAt(OffsetDateTime.now());

        pageSectionRepository.save(section);

        updateTranslation(
            section,
            "en",
            request.en()
        );

        updateTranslation(
            section,
            "fr",
            request.fr()
        );

        return toResponse(section, "en");
    }

    @Transactional
    public HomepageResponse updateSections(UpdateHomepageRequest request) {
        Set<String> sectionKeys = new HashSet<>();
        for (HomepageSectionUpdateRequest update : request.sections()) {
            if (!sectionKeys.add(update.sectionKey())) {
                throw new IllegalArgumentException(
                    "A homepage section can only be updated once per request."
                );
            }
            updateSection(update.sectionKey(), update.data());
        }
        return getAdminHomepage("en");
    }

    private void updateTranslation(
        PageSection section,
        String locale,
        SectionTranslationRequest request
    ) {

        if (request == null) {
            return;
        }

        PageSectionTranslation translation =
            translationRepository
                .findByPageSectionIdAndLocale(
                    section.getId(),
                    locale
                )
                .orElseGet(() ->
                    PageSectionTranslation.builder()
                        .id(UUID.randomUUID())
                        .pageSection(section)
                        .locale(locale)
                        .createdAt(OffsetDateTime.now())
                        .updatedAt(OffsetDateTime.now())
                        .build()
                );

        translation.setTitle(request.title());
        translation.setSubtitle(request.subtitle());
        translation.setBody(request.body());
        translation.setButtonText(
            request.buttonText()
        );

        translation.setUpdatedAt(
            OffsetDateTime.now()
        );

        translationRepository.save(translation);
    }

    private HomepageSectionResponse toResponse(
        PageSection section,
        String locale
    ) {

        PageSectionTranslation translation =
            translationRepository
                .findByPageSectionIdAndLocale(
                    section.getId(),
                    locale
                )
                .orElse(null);

        return new HomepageSectionResponse(
            section.getSectionKey(),
            section.getSectionType().name(),
            section.getDisplayOrder(),
            section.getEnabled(),

            translation != null
                ? translation.getTitle()
                : null,

            translation != null
                ? translation.getSubtitle()
                : null,

            translation != null
                ? translation.getBody()
                : null,

            translation != null
                ? translation.getButtonText()
                : null,

            section.getSettings()
        );
    }

    private Page getHomepage() {
        return pageRepository
            .findBySlug("/")
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Homepage not found."
                )
            );
    }

    private void validateLocale(String locale) {
        if (
            !"en".equalsIgnoreCase(locale) &&
            !"fr".equalsIgnoreCase(locale)
        ) {
            throw new IllegalArgumentException(
                "Unsupported locale."
            );
        }
    }
}
