package com.sharehope.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class PublicFormGuard {
    private final byte[] expected;
    public PublicFormGuard(@Value("${app.public-form.internal-secret:}") String secret) {
        expected = secret.getBytes(StandardCharsets.UTF_8);
    }
    public void requireValid(String supplied) {
        byte[] actual = supplied == null ? new byte[0] : supplied.getBytes(StandardCharsets.UTF_8);
        if (expected.length < 32 || !MessageDigest.isEqual(expected, actual)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid public form gateway.");
        }
    }
}
