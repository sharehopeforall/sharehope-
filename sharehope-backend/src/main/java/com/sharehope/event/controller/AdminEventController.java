package com.sharehope.event.controller;

import com.sharehope.event.dto.*;
import com.sharehope.event.service.EventRegistrationService;
import com.sharehope.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
public class AdminEventController {
    private final EventService service;
    private final EventRegistrationService registrationService;

    @GetMapping public List<EventResponse> list() { return service.adminList(); }
    @GetMapping("/{id}/registrations") public List<EventRegistrationResponse> registrations(@PathVariable UUID id) { return registrationService.listForEvent(id); }
    @PatchMapping("/{eventId}/registrations/{registrationId}") public EventRegistrationResponse updateRegistrationStatus(@PathVariable UUID eventId, @PathVariable UUID registrationId, @Valid @RequestBody EventRegistrationStatusRequest request) { return registrationService.updateStatus(eventId, registrationId, request.status()); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public EventResponse create(@Valid @RequestBody EventRequest r) { return service.create(r); }
    @PutMapping("/{id}") public EventResponse update(@PathVariable UUID id, @Valid @RequestBody EventRequest r) { return service.update(id, r); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable UUID id) { service.delete(id); }
}
