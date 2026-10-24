package com.sharehope.team.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "team_members")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TeamMember {
    @Id private UUID id;
    @Column(nullable = false, length = 160) private String fullName;
    @Column(nullable = false, length = 160) private String jobTitle;
    @Column(length = 120) private String department;
    private LocalDate startDate;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private TeamMemberStatus status;
    @Column(length = 320) private String workEmail;
    @Column(length = 60) private String phone;
    @Column(length = 160) private String location;
    @Column(length = 160) private String managerName;
    @Column(columnDefinition = "text") private String notes;
    @Column(columnDefinition = "text") private String photoUrl;
    @Column(nullable = false) private OffsetDateTime createdAt;
    @Column(nullable = false) private OffsetDateTime updatedAt;

    @PrePersist void create() {
        var now = OffsetDateTime.now();
        if (id == null) id = UUID.randomUUID();
        if (status == null) status = TeamMemberStatus.ACTIVE;
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate void update() { updatedAt = OffsetDateTime.now(); }
}
