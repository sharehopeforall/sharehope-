package com.sharehope.auth.repository;

import com.sharehope.auth.model.AuthRateLimit;
import jakarta.persistence.LockModeType;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuthRateLimitRepository extends JpaRepository<AuthRateLimit, String> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select rate from AuthRateLimit rate where rate.rateKey = :key")
    Optional<AuthRateLimit> findForUpdate(@Param("key") String key);

    @Modifying
    @Query("delete from AuthRateLimit rate where rate.windowStarted < :cutoff and (rate.blockedUntil is null or rate.blockedUntil < :cutoff)")
    int deleteExpired(@Param("cutoff") OffsetDateTime cutoff);
}
