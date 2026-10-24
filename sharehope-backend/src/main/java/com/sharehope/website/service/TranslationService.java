package com.sharehope.website.service;

import com.sharehope.website.dto.TranslateContentResponse;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

@Service
public class TranslationService {

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String authKey;
    private final String apiUrl;

    public TranslationService(
            ObjectMapper objectMapper,
            @Value("${app.translation.deepl-auth-key:}") String authKey,
            @Value("${app.translation.deepl-api-url:https://api-free.deepl.com/v2/translate}") String apiUrl
    ) {
        this.objectMapper = objectMapper;
        this.authKey = authKey;
        this.apiUrl = apiUrl;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public TranslateContentResponse translateEnglishToFrench(Map<String, String> fields) {
        if (authKey.isBlank()) {
            throw new IllegalStateException(
                    "Automatic translation is not configured. Set DEEPL_AUTH_KEY on the backend."
            );
        }

        Map<String, String> sourceFields = new LinkedHashMap<>();
        fields.forEach((key, value) -> {
            if (value != null && !value.isBlank()) {
                sourceFields.put(key, value);
            }
        });

        if (sourceFields.isEmpty()) {
            return new TranslateContentResponse(Map.of());
        }

        ObjectNode payload = objectMapper.createObjectNode();
        ArrayNode text = payload.putArray("text");
        sourceFields.values().forEach(text::add);
        payload.put("source_lang", "EN");
        payload.put("target_lang", "FR");

        HttpRequest request;
        try {
            request = HttpRequest.newBuilder(URI.create(apiUrl))
                    .timeout(Duration.ofSeconds(30))
                    .header("Authorization", "DeepL-Auth-Key " + authKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException("Could not prepare the translation request.", exception);
        }

        try {
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException(
                        "Translation provider returned status " + response.statusCode() + "."
                );
            }

            JsonNode translations = objectMapper.readTree(response.body()).path("translations");
            List<String> keys = sourceFields.keySet().stream().toList();
            if (!translations.isArray() || translations.size() != keys.size()) {
                throw new IllegalStateException("Translation provider returned an unexpected response.");
            }

            Map<String, String> translatedFields = new LinkedHashMap<>();
            for (int index = 0; index < keys.size(); index++) {
                translatedFields.put(keys.get(index), translations.get(index).path("text").asText());
            }
            return new TranslateContentResponse(translatedFields);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Translation request was interrupted.", exception);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not contact the translation provider.", exception);
        }
    }
}
