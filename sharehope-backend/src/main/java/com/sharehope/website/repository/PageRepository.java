package com.sharehope.website.repository;

import com.sharehope.website.model.Page;
import com.sharehope.website.model.PageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PageRepository extends JpaRepository<Page, UUID> {

    Optional<Page> findBySlug(String slug);

    Optional<Page> findBySlugAndStatus(
        String slug,
        PageStatus status
    );
}
