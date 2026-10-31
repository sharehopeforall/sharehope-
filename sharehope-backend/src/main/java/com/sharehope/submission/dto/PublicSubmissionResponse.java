package com.sharehope.submission.dto;
import com.sharehope.submission.model.PublicSubmission; import java.time.OffsetDateTime; import java.util.UUID;
public record PublicSubmissionResponse(UUID id,String submissionType,String firstName,String lastName,String email,String phone,String organization,String subject,String details,String locale,String status,OffsetDateTime createdAt){
 public static PublicSubmissionResponse from(PublicSubmission v){return new PublicSubmissionResponse(v.getId(),v.getSubmissionType(),v.getFirstName(),v.getLastName(),v.getEmail(),v.getPhone(),v.getOrganization(),v.getSubject(),v.getDetails(),v.getLocale(),v.getStatus(),v.getCreatedAt());}}
