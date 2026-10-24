package com.sharehope.newsletter.service;

import com.sharehope.newsletter.dto.NewsletterSubscribeRequest;
import com.sharehope.newsletter.dto.NewsletterSubscribeResponse;
import com.sharehope.newsletter.model.NewsletterSubscriber;
import com.sharehope.newsletter.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterSubscriberRepository repository;

    @Transactional
    public NewsletterSubscribeResponse subscribe(NewsletterSubscribeRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        if (!repository.existsByEmailIgnoreCase(email)) {
            repository.save(NewsletterSubscriber.builder()
                    .email(email)
                    .firstName(normalizeName(request.firstName()))
                    .lastName(normalizeName(request.lastName()))
                    .locale(request.locale() == null ? "en" : request.locale())
                    .build());
        }

        return new NewsletterSubscribeResponse(true);
    }

    private String normalizeName(String value) {
        if (value == null || value.isBlank()) return null;
        return value.trim();
    }
}
