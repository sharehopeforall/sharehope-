package com.sharehope.submission.controller;
import com.sharehope.submission.dto.*; import com.sharehope.submission.model.PublicSubmission; import com.sharehope.submission.repository.PublicSubmissionRepository; import com.sharehope.notification.NotificationService;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor; import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/public/submissions") @RequiredArgsConstructor
public class PublicSubmissionController{private final PublicSubmissionRepository repository;private final NotificationService notifications;
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public java.util.Map<String,Object> create(@Valid @RequestBody PublicSubmissionRequest r){
  String email=r.email().trim().toLowerCase();if(repository.existsBySubmissionTypeAndEmailIgnoreCaseAndCreatedAtAfter(r.submissionType(),email,java.time.OffsetDateTime.now().minusHours(24)))throw new com.sharehope.exception.ResourceAlreadyExistsException("An application from this email was recently received.");
  PublicSubmission v=PublicSubmission.builder().submissionType(r.submissionType()).firstName(r.firstName().trim()).lastName(r.lastName().trim()).email(email).phone(clean(r.phone())).organization(clean(r.organization())).subject(clean(r.subject())).details(r.details().trim()).locale(r.locale()==null?"en":r.locale()).build();v=repository.save(v);notifications.sendAdminAlert("New ShareHope application","/en/admin/submissions");return java.util.Map.of("id",v.getId(),"accepted",true);}
 private String clean(String v){return v==null||v.isBlank()?null:v.trim();}}
