package com.sharehope.team.repository;

import com.sharehope.team.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface TeamMemberRepository extends JpaRepository<TeamMember, UUID> {
    List<TeamMember> findAllByOrderByFullNameAsc();
}
