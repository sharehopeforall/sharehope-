package com.sharehope.team.dto;

import com.sharehope.team.model.TeamMemberStatus;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record TeamMemberRequest(
        @NotBlank @Size(max = 160) String fullName,
        @NotBlank @Size(max = 160) String jobTitle,
        @Size(max = 120) String department,
        LocalDate startDate,
        @NotNull TeamMemberStatus status,
        @Email @Size(max = 320) String workEmail,
        @Size(max = 60) String phone,
        @Size(max = 160) String location,
        @Size(max = 160) String managerName,
        @Size(max = 4000) String notes,
        String photoUrl
) {}
