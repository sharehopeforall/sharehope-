package com.sharehope.submission.service;

import com.sharehope.submission.repository.PublicSubmissionRepository;
import java.time.OffsetDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionRetentionService {
    private final PublicSubmissionRepository repository;

    @Value("${app.submissions.closed-retention-days:730}")
    private long retentionDays;

    @Scheduled(cron = "${app.submissions.cleanup-cron:0 30 3 * * *}")
    @Transactional
    public void removeExpiredClosedApplications() {
        long removed = repository.deleteByStatusAndStatusUpdatedAtBefore(
                "CLOSED", OffsetDateTime.now().minusDays(retentionDays));
        if (removed > 0) log.info("Removed {} closed applications under the retention policy", removed);
    }
}
