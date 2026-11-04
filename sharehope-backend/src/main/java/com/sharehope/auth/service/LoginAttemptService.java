package com.sharehope.auth.service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LoginAttemptService {
    private static final int MAX_FAILURES = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);
    private final ConcurrentHashMap<String, Attempt> attempts = new ConcurrentHashMap<>();

    public void checkAllowed(String key) {
        Attempt attempt = attempts.get(key);
        if (attempt == null || attempt.windowStarted().plus(WINDOW).isBefore(Instant.now())) {
            attempts.remove(key, attempt);
            return;
        }
        if (attempt.failures() >= MAX_FAILURES) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many login attempts. Try again later.");
        }
    }

    public void recordFailure(String key) {
        Instant now = Instant.now();
        attempts.compute(key, (ignored, current) ->
                current == null || current.windowStarted().plus(WINDOW).isBefore(now)
                        ? new Attempt(1, now)
                        : new Attempt(current.failures() + 1, current.windowStarted()));
    }

    public void recordSuccess(String key) {
        attempts.remove(key);
    }

    private record Attempt(int failures, Instant windowStarted) {}
}
