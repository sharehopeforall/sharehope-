package com.sharehope.newsletter.service;

import com.sharehope.newsletter.dto.NewsletterSubscribeRequest;
import com.sharehope.newsletter.dto.NewsletterSubscribeResponse;
import com.sharehope.newsletter.model.NewsletterSubscriber;
import com.sharehope.newsletter.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import java.net.URI;
import java.net.http.*;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterSubscriberRepository repository;
    @Value("${app.brevo.api-key:}") private String brevoApiKey;
    @Value("${app.brevo.list-id:}") private String brevoListId;

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
            syncBrevo(request, email);
        }

        return new NewsletterSubscribeResponse(true);
    }

    private void syncBrevo(NewsletterSubscribeRequest request, String email) {
        if (brevoApiKey.isBlank()) return;
        try {
            String names = String.format("{\"FIRSTNAME\":\"%s\",\"LASTNAME\":\"%s\",\"LOCALE\":\"%s\"}", escape(request.firstName()), escape(request.lastName()), escape(request.locale()));
            String lists = brevoListId.isBlank() ? "" : ",\"listIds\":[" + Integer.parseInt(brevoListId) + "]";
            String json = "{\"email\":\"" + escape(email) + "\",\"attributes\":" + names + lists + ",\"updateEnabled\":true}";
            HttpRequest call = HttpRequest.newBuilder(URI.create("https://api.brevo.com/v3/contacts")).header("api-key", brevoApiKey).header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(json)).build();
            HttpClient.newHttpClient().send(call, HttpResponse.BodyHandlers.discarding());
        } catch (Exception ignored) { /* Local subscription remains authoritative and can be retried. */ }
    }
    private String escape(String value) { return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\""); }

    private String normalizeName(String value) {
        if (value == null || value.isBlank()) return null;
        return value.trim();
    }
}
