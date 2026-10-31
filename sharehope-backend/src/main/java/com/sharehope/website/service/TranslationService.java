package com.sharehope.website.service;

import com.sharehope.website.dto.TranslateContentResponse;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.ArrayList;
import java.util.Iterator;
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
        return translate(fields, "EN", "FR");
    }

    public Map<String, Object> translateContent(
            Map<String, Object> content,
            String sourceLanguage,
            String targetLanguage
    ) {
        List<String> sourceTexts = new ArrayList<>();
        collectStrings(content, sourceTexts);
        if (sourceTexts.isEmpty()) return copy(content);

        List<String> translatedTexts = new ArrayList<>();
        for (int offset = 0; offset < sourceTexts.size(); offset += 50) {
            Map<String, String> indexed = new LinkedHashMap<>();
            int end = Math.min(offset + 50, sourceTexts.size());
            for (int index = offset; index < end; index++) {
                indexed.put("field" + index, sourceTexts.get(index));
            }
            translatedTexts.addAll(
                    translate(indexed, sourceLanguage, targetLanguage).fields().values()
            );
        }
        Iterator<String> translated = translatedTexts.iterator();
        return asMap(rebuild(content, translated));
    }

    private TranslateContentResponse translate(
            Map<String, String> fields,
            String sourceLanguage,
            String targetLanguage
    ) {
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
        payload.put("source_lang", sourceLanguage);
        payload.put("target_lang", targetLanguage);

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

    private void collectStrings(Object value, List<String> texts) {
        if (value instanceof Map<?, ?> map) {
            Object patchType = map.get("type");
            if (patchType != null && map.containsKey("value")) {
                Object patchValue = map.get("value");
                if ("text".equals(String.valueOf(patchType))
                        && patchValue instanceof String text
                        && shouldTranslate(text)) {
                    texts.add(text);
                }
                return;
            }
            map.values().forEach(item -> collectStrings(item, texts));
        } else if (value instanceof List<?> list) {
            list.forEach(item -> collectStrings(item, texts));
        } else if (value instanceof String text && shouldTranslate(text)) {
            texts.add(text);
        }
    }

    private Object rebuild(Object value, Iterator<String> translated) {
        if (value instanceof Map<?, ?> map) {
            Map<String, Object> result = new LinkedHashMap<>();
            Object patchType = map.get("type");
            boolean visualPatch = patchType != null && map.containsKey("value");
            map.forEach((key, item) -> {
                String field = String.valueOf(key);
                if (visualPatch && "value".equals(field)
                        && "text".equals(String.valueOf(patchType))
                        && item instanceof String text && shouldTranslate(text)) {
                    result.put(field, translated.next());
                } else if (visualPatch) {
                    result.put(field, item);
                } else {
                    result.put(field, rebuild(item, translated));
                }
            });
            return result;
        }
        if (value instanceof List<?> list) {
            return list.stream().map(item -> rebuild(item, translated)).toList();
        }
        if (value instanceof String text && shouldTranslate(text)) return translated.next();
        return value;
    }

    private boolean shouldTranslate(String value) {
        String text = value.trim();
        return !text.isEmpty()
                && !text.matches("^(https?://|/|#|mailto:|tel:|data:|blob:).*" )
                && !text.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object value) {
        return (Map<String, Object>) value;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> copy(Map<String, Object> value) {
        return objectMapper.convertValue(value, Map.class);
    }
}
