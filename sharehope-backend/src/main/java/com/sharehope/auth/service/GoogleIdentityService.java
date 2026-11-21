package com.sharehope.auth.service;

import com.sharehope.exception.InvalidCredentialsException;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtTimestampValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

@Service
public class GoogleIdentityService {
    private static final Set<String> VALID_ISSUERS = Set.of("accounts.google.com", "https://accounts.google.com");
    private final String clientId;
    private final JwtDecoder decoder;

    public GoogleIdentityService(@Value("${app.google.client-id:}") String clientId) {
        this.clientId = clientId == null ? "" : clientId.trim();
        NimbusJwtDecoder googleDecoder = NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs").build();
        OAuth2TokenValidator<Jwt> googleClaims = token -> {
            boolean validIssuer = token.getIssuer() != null && VALID_ISSUERS.contains(token.getIssuer().toString());
            boolean validAudience = token.getAudience().contains(this.clientId);
            boolean verifiedEmail = Boolean.TRUE.equals(token.getClaimAsBoolean("email_verified"));
            if (validIssuer && validAudience && verifiedEmail) return OAuth2TokenValidatorResult.success();
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Google identity claims are invalid.", null));
        };
        googleDecoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(new JwtTimestampValidator(), googleClaims));
        this.decoder = googleDecoder;
    }

    public GoogleIdentity verify(String credential) {
        if (clientId.isBlank()) throw new InvalidCredentialsException("Google sign-in is not configured.");
        try {
            Jwt token = decoder.decode(credential);
            String email = token.getClaimAsString("email");
            if (email == null || email.isBlank()) throw new InvalidCredentialsException("Google did not provide a verified email address.");
            return new GoogleIdentity(
                    email.trim().toLowerCase(),
                    value(token.getClaimAsString("given_name")),
                    value(token.getClaimAsString("family_name"))
            );
        } catch (JwtException exception) {
            throw new InvalidCredentialsException("Google sign-in could not be verified.");
        }
    }

    private String value(String value) { return value == null ? "" : value.trim(); }

    public record GoogleIdentity(String email, String firstName, String lastName) {}
}
