package com.sharehope.auth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "auth_rate_limits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthRateLimit {
    @Id
    @Column(name = "rate_key", length = 64)
    private String rateKey;
    @Column(nullable = false)
    private int failures;
    @Column(name = "window_started", nullable = false)
    private OffsetDateTime windowStarted;
    @Column(name = "blocked_until")
    private OffsetDateTime blockedUntil;
}
