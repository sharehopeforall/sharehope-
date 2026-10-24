package com.sharehope.website.repository;

import com.sharehope.website.model.PageSectionTranslation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PageSectionTranslationRepository
        extends JpaRepository<PageSectionTranslation, UUID> {

    Optional<PageSectionTranslation>
        findByPageSectionIdAndLocale(
            UUID pageSectionId,
            String locale
        );
}
