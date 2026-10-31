package com.sharehope.submission.dto;
import jakarta.validation.constraints.*;
public record PublicSubmissionRequest(@NotBlank @Pattern(regexp="VOLUNTEER|PARTNERSHIP") String submissionType,
 @NotBlank @Size(max=100) String firstName,@NotBlank @Size(max=100) String lastName,
 @NotBlank @Email @Size(max=320) String email,@Size(max=40) String phone,@Size(max=200) String organization,
 @Size(max=200) String subject,@NotBlank @Size(max=5000) String details,@Pattern(regexp="en|fr") String locale){}
