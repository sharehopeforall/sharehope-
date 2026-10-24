package com.sharehope.newsletter.controller;

import com.sharehope.newsletter.dto.NewsletterSubscribeRequest;
import com.sharehope.newsletter.dto.NewsletterSubscribeResponse;
import com.sharehope.newsletter.service.NewsletterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/newsletter")
@RequiredArgsConstructor
public class PublicNewsletterController {

    private final NewsletterService newsletterService;

    @PostMapping("/subscribe")
    @ResponseStatus(HttpStatus.CREATED)
    public NewsletterSubscribeResponse subscribe(
            @Valid @RequestBody NewsletterSubscribeRequest request
    ) {
        return newsletterService.subscribe(request);
    }
}
