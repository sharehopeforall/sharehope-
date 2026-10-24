package com.sharehope.program.repository;

import com.sharehope.program.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ProgramRepository extends JpaRepository<Program, UUID> {
    List<Program> findAllByOrderByDisplayOrderAsc();
    List<Program> findByPublishedTrueOrderByDisplayOrderAsc();
    Optional<Program> findBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, UUID id);
}
