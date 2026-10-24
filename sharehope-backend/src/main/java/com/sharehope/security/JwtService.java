package com.sharehope.security;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.sharehope.user.model.User;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Responsible only for generating short-lived, signed JWT access tokens.
 * The token carries the minimum claims needed to identify and authorize a
 * user: subject (user id), email, role, issued-at, and expiration.
 * <p>
 * Never put sensitive information (password, password hash, invitation
 * token) in the JWT payload - it is base64-encoded, not encrypted, so
 * anyone holding the token can read its claims.
 */
@Service
public class JwtService {

    private final byte[] secretKeyBytes;
    private final long expirationMinutes;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-minutes}") long expirationMinutes
    ) {
        this.secretKeyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationMinutes = expirationMinutes;
    }

    public String generateToken(User user, String role) {

        Instant now = Instant.now();
        Instant expiresAt = now.plus(expirationMinutes, ChronoUnit.MINUTES);

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("role", role)
                .issueTime(Date.from(now))
                .expirationTime(Date.from(expiresAt))
                .build();

        try {
            SignedJWT signedJwt = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256),
                    claims
            );

            signedJwt.sign(new MACSigner(secretKeyBytes));

            return signedJwt.serialize();

        } catch (JOSEException e) {
            throw new IllegalStateException("Failed to sign JWT", e);
        }
    }

    public long getExpirationSeconds() {
        return expirationMinutes * 60;
    }
}
