package com.sharehope.website.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "visual_page_content", uniqueConstraints = @UniqueConstraint(name = "uq_visual_page_path_locale", columnNames = {"page_path", "locale"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VisualPageContent {
    @Id private UUID id;
    @Column(name = "page_path", nullable = false) private String pagePath;
    @Column(nullable = false, length = 10) private String locale;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "draft_content", columnDefinition = "jsonb", nullable = false) @Builder.Default private Map<String, Object> draftContent = new HashMap<>();
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "published_content", columnDefinition = "jsonb", nullable = false) @Builder.Default private Map<String, Object> publishedContent = new HashMap<>();
    @Column(name = "updated_at", nullable = false) private OffsetDateTime updatedAt;
    @Column(name = "published_at") private OffsetDateTime publishedAt;

    @PrePersist void onCreate() { if (id == null) id = UUID.randomUUID(); if (updatedAt == null) updatedAt = OffsetDateTime.now(); }
    @PreUpdate void onUpdate() { updatedAt = OffsetDateTime.now(); }
}
