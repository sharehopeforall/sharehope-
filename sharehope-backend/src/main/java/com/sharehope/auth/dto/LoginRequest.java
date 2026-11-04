package com.sharehope.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(max = 128)
        String password,

        @jakarta.validation.constraints.Pattern(regexp = "^$|^[0-9]{6}$", message = "Authenticator code must contain six digits")
        String mfaCode

) {}
