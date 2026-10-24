package com.sharehope.team.controller;

import com.sharehope.team.dto.*;
import com.sharehope.team.service.TeamMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/team")
@RequiredArgsConstructor
public class AdminTeamMemberController {
    private final TeamMemberService service;

    @GetMapping public List<TeamMemberResponse> list() { return service.list(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public TeamMemberResponse create(@Valid @RequestBody TeamMemberRequest request) { return service.create(request); }
    @PutMapping("/{id}") public TeamMemberResponse update(@PathVariable UUID id, @Valid @RequestBody TeamMemberRequest request) { return service.update(id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable UUID id) { service.delete(id); }
}
