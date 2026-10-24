package com.sharehope.program.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "programs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Program {
    @Id private UUID id;
    @Column(nullable = false, unique = true, length = 150) private String slug;
    @Column(nullable = false, length = 80) private String category;
    @Column(nullable = false) private Integer displayOrder;
    @Column(nullable = false) private Boolean published;
    @Column(nullable = false) private Boolean featured;
    @Column(columnDefinition = "text") private String imageUrl;
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    @Builder.Default private Map<String, Object> translations = new HashMap<>();
    @Column(nullable = false) private OffsetDateTime createdAt;
    @Column(nullable = false) private OffsetDateTime updatedAt;
    @PrePersist void create() { var now = OffsetDateTime.now(); if (id == null) id = UUID.randomUUID(); if (createdAt == null) createdAt = now; updatedAt = now; if (published == null) published = false; if (featured == null) featured = false; if (displayOrder == null) displayOrder = 0; }
    @PreUpdate void update() { updatedAt = OffsetDateTime.now(); }
}
