package com.sharehope.event.controller;

import com.sharehope.event.dto.EventRsvpRequest;
import com.sharehope.event.dto.EventRsvpResponse;
import com.sharehope.event.dto.PublicEventResponse;
import com.sharehope.event.service.EventRegistrationService;
import com.sharehope.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/events")
@RequiredArgsConstructor
public class PublicEventController {
    private final EventService service;
    private final EventRegistrationService registrationService;
    private final com.sharehope.security.PublicFormGuard publicFormGuard;

    @GetMapping
    public List<PublicEventResponse> list(@RequestParam(defaultValue = "en") String locale) {
        return service.publicList(locale);
    }

    @GetMapping("/{slug}")
    public PublicEventResponse detail(@PathVariable String slug, @RequestParam(defaultValue = "en") String locale) {
        return service.publicOne(slug, locale);
    }

    @PostMapping("/{slug}/rsvp")
    @ResponseStatus(HttpStatus.CREATED)
    public EventRsvpResponse rsvp(@PathVariable String slug, @RequestHeader(value="X-Public-Form-Secret",required=false) String formSecret, @Valid @RequestBody EventRsvpRequest request) {
        publicFormGuard.requireValid(formSecret);
        return registrationService.register(slug, request);
    }
}
