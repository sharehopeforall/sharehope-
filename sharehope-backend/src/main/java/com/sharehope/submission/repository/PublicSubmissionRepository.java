package com.sharehope.submission.repository;
import com.sharehope.submission.model.PublicSubmission; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PublicSubmissionRepository extends JpaRepository<PublicSubmission,UUID>{List<PublicSubmission> findAllByOrderByCreatedAtDesc();boolean existsBySubmissionTypeAndEmailIgnoreCaseAndCreatedAtAfter(String submissionType,String email,java.time.OffsetDateTime after);long deleteByStatusAndStatusUpdatedAtBefore(String status,java.time.OffsetDateTime before);}
