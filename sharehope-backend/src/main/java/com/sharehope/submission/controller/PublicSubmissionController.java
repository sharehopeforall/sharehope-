package com.sharehope.submission.controller;
import com.sharehope.submission.dto.*; import com.sharehope.submission.model.PublicSubmission; import com.sharehope.submission.repository.PublicSubmissionRepository;
import jakarta.validation.Valid; import lombok.RequiredArgsConstructor; import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/public/submissions") @RequiredArgsConstructor
public class PublicSubmissionController{private final PublicSubmissionRepository repository;
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public PublicSubmissionResponse create(@Valid @RequestBody PublicSubmissionRequest r){
  PublicSubmission v=PublicSubmission.builder().submissionType(r.submissionType()).firstName(r.firstName().trim()).lastName(r.lastName().trim()).email(r.email().trim().toLowerCase()).phone(clean(r.phone())).organization(clean(r.organization())).subject(clean(r.subject())).details(r.details().trim()).locale(r.locale()==null?"en":r.locale()).build();return PublicSubmissionResponse.from(repository.save(v));}
 private String clean(String v){return v==null||v.isBlank()?null:v.trim();}}
