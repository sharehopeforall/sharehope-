package com.sharehope.website.repository;

import com.sharehope.website.model.PageSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PageSectionRepository
        extends JpaRepository<PageSection, UUID> {

    List<PageSection> findByPageIdAndEnabledTrueOrderByDisplayOrderAsc(
        UUID pageId
    );

    List<PageSection> findByPageIdOrderByDisplayOrderAsc(
        UUID pageId
    );

    Optional<PageSection> findByPageIdAndSectionKey(
        UUID pageId,
        String sectionKey
    );
}
