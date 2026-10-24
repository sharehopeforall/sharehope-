package com.sharehope.team.service;

import com.sharehope.exception.ResourceNotFoundException;
import com.sharehope.team.dto.*;
import com.sharehope.team.model.TeamMember;
import com.sharehope.team.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @RequiredArgsConstructor
public class TeamMemberService {
    private final TeamMemberRepository repository;

    @Transactional(readOnly = true)
    public List<TeamMemberResponse> list() {
        return repository.findAllByOrderByFullNameAsc().stream().map(this::response).toList();
    }

    @Transactional
    public TeamMemberResponse create(TeamMemberRequest request) {
        TeamMember member = new TeamMember();
        apply(member, request);
        return response(repository.save(member));
    }

    @Transactional
    public TeamMemberResponse update(UUID id, TeamMemberRequest request) {
        TeamMember member = get(id);
        apply(member, request);
        return response(repository.save(member));
    }

    @Transactional
    public void delete(UUID id) { repository.delete(get(id)); }

    private TeamMember get(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Team member not found."));
    }

    private void apply(TeamMember member, TeamMemberRequest request) {
        member.setFullName(request.fullName().trim());
        member.setJobTitle(request.jobTitle().trim());
        member.setDepartment(clean(request.department()));
        member.setStartDate(request.startDate());
        member.setStatus(request.status());
        member.setWorkEmail(clean(request.workEmail()));
        member.setPhone(clean(request.phone()));
        member.setLocation(clean(request.location()));
        member.setManagerName(clean(request.managerName()));
        member.setNotes(clean(request.notes()));
        member.setPhotoUrl(clean(request.photoUrl()));
    }

    private String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }

    private TeamMemberResponse response(TeamMember member) {
        return new TeamMemberResponse(member.getId(), member.getFullName(), member.getJobTitle(),
                member.getDepartment(), member.getStartDate(), member.getStatus(), member.getWorkEmail(),
                member.getPhone(), member.getLocation(), member.getManagerName(), member.getNotes(),
                member.getPhotoUrl(), member.getCreatedAt(), member.getUpdatedAt());
    }
}
