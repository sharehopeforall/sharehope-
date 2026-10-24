package com.sharehope.blog.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogPost {
    @Id
    private UUID id;

    @Column(nullable = false, unique = true, length = 180)
    private String slug;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(nullable = false, length = 20)
    private String format;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(nullable = false)
    private Boolean featured;

    @Column(nullable = false)
    private Integer displayOrder;

    @Column(columnDefinition = "text")
    private String coverImageUrl;

    @Column(columnDefinition = "text")
    private String videoUrl;

    private Integer durationSeconds;

    @Column(length = 180)
    private String relatedProgramSlug;

    private OffsetDateTime publishedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    @Builder.Default
    private Map<String, Object> translations = new HashMap<>();

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void create() {
        OffsetDateTime now = OffsetDateTime.now();
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
        if (format == null) format = "ARTICLE";
        if (status == null) status = "DRAFT";
        if (featured == null) featured = false;
        if (displayOrder == null) displayOrder = 0;
    }

    @PreUpdate
    void update() {
        updatedAt = OffsetDateTime.now();
    }
}
