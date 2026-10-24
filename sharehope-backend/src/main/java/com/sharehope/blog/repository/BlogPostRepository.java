package com.sharehope.blog.repository;

import com.sharehope.blog.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BlogPostRepository extends JpaRepository<BlogPost, UUID> {
    Optional<BlogPost> findBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, UUID id);
    List<BlogPost> findAllByOrderByUpdatedAtDesc();
    List<BlogPost> findByStatusOrderByFeaturedDescPublishedAtDescDisplayOrderAsc(String status);
}
