package com.sharehope.website.repository;

import com.sharehope.website.model.VisualPageContent;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisualPageContentRepository extends JpaRepository<VisualPageContent, UUID> {
    Optional<VisualPageContent> findByPagePathAndLocale(String pagePath, String locale);
}
