package com.sharehope.auth.dto;

import java.util.UUID;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        UUID userId,
        String firstName,
        String lastName,
        String email,
        String role
) {}
