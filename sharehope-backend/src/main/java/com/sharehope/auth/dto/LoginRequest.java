package com.sharehope.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(max = 128)
        String password,

        @Pattern(regexp = "^$|^[0-9]{6}$")
        String mfaCode

) {}
