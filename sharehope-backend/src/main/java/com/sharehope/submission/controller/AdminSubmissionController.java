package com.sharehope.submission.controller;
import com.sharehope.submission.dto.PublicSubmissionResponse; import com.sharehope.submission.repository.PublicSubmissionRepository; import lombok.RequiredArgsConstructor; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/admin/submissions") @RequiredArgsConstructor
public class AdminSubmissionController{private final PublicSubmissionRepository repository;@GetMapping public List<PublicSubmissionResponse> list(){return repository.findAllByOrderByCreatedAtDesc().stream().map(PublicSubmissionResponse::from).toList();}}
