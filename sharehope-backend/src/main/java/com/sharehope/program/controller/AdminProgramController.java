package com.sharehope.program.controller;
import com.sharehope.program.dto.*;
import com.sharehope.program.service.ProgramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/admin/programs") @RequiredArgsConstructor
public class AdminProgramController {
 private final ProgramService service;
 @GetMapping public List<ProgramResponse> list(){return service.adminList();}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public ProgramResponse create(@Valid @RequestBody ProgramRequest request){return service.create(request);}
 @PutMapping("/{id}") public ProgramResponse update(@PathVariable UUID id,@Valid @RequestBody ProgramRequest request){return service.update(id,request);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable UUID id){service.delete(id);}
}
