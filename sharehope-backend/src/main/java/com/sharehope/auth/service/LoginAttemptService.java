package com.sharehope.auth.service;

import com.sharehope.auth.model.AuthRateLimit;
import com.sharehope.auth.repository.AuthRateLimitRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LoginAttemptService {
    private static final int MAX_FAILURES = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);
    private final AuthRateLimitRepository attempts;

    public LoginAttemptService(AuthRateLimitRepository attempts) {
        this.attempts = attempts;
    }

    @Transactional(readOnly = true)
    public void checkAllowed(String rawKey) {
        OffsetDateTime now = OffsetDateTime.now();
        attempts.findById(hash(rawKey))
                .filter(attempt -> attempt.getBlockedUntil() != null && attempt.getBlockedUntil().isAfter(now))
                .ifPresent(attempt -> {
                    throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many attempts. Try again later.");
                });
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void recordFailure(String rawKey) {
        String key = hash(rawKey);
        OffsetDateTime now = OffsetDateTime.now();
        AuthRateLimit attempt = attempts.findForUpdate(key).orElse(null);
        if (attempt == null || attempt.getWindowStarted().plus(WINDOW).isBefore(now)) {
            attempt = new AuthRateLimit(key, 1, now, null);
        } else {
            attempt.setFailures(attempt.getFailures() + 1);
        }
        if (attempt.getFailures() >= MAX_FAILURES) attempt.setBlockedUntil(now.plus(WINDOW));
        attempts.save(attempt);
    }

    @Transactional
    public void recordSuccess(String rawKey) {
        attempts.deleteById(hash(rawKey));
    }

    @Scheduled(cron = "0 17 * * * *")
    @Transactional
    public void removeExpiredEntries() {
        attempts.deleteExpired(OffsetDateTime.now().minus(WINDOW));
    }

    private String hash(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception error) {
            throw new IllegalStateException("Unable to protect authentication throttle key", error);
        }
    }
}
