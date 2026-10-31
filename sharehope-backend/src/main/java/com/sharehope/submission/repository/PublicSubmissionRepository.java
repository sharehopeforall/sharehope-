package com.sharehope.submission.repository;
import com.sharehope.submission.model.PublicSubmission; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PublicSubmissionRepository extends JpaRepository<PublicSubmission,UUID>{List<PublicSubmission> findAllByOrderByCreatedAtDesc();}
