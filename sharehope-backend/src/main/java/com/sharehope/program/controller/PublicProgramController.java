package com.sharehope.program.controller;
import com.sharehope.program.dto.PublicProgramResponse;
import com.sharehope.program.service.ProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/public/programs") @RequiredArgsConstructor
public class PublicProgramController { private final ProgramService service; @GetMapping public List<PublicProgramResponse> list(@RequestParam(defaultValue="en") String locale) { return service.publicList(locale); } }
