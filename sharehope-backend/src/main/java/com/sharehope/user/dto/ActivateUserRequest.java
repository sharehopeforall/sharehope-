package com.sharehope.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ActivateUserRequest(

        @NotBlank
        String token,

        @NotBlank
        @Size(min = 8)
        String password

) {}
