package com.sharehope.team.dto;

import com.sharehope.team.model.TeamMemberStatus;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TeamMemberResponse(
        UUID id,
        String fullName,
        String jobTitle,
        String department,
        LocalDate startDate,
        TeamMemberStatus status,
        String workEmail,
        String phone,
        String location,
        String managerName,
        String notes,
        String photoUrl,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
