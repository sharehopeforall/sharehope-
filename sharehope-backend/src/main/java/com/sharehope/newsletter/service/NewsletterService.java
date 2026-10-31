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
    @Value("${app.newsletter.unsubscribe-secret:}") private String unsubscribeSecret;
    @Value("${app.public-url:https://www.sharehopeforall.org}") private String publicUrl;
    @Value("${app.notifications.sender-email:}") private String senderEmail;

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
            sendWelcomeEmail(request, email);
        }

        return new NewsletterSubscribeResponse(true);
    }

    private void syncBrevo(NewsletterSubscribeRequest request, String email) {
        if (brevoApiKey.isBlank() || unsubscribeSecret.isBlank()) return;
        try {
            String names = String.format("{\"FIRSTNAME\":\"%s\",\"LASTNAME\":\"%s\",\"LOCALE\":\"%s\",\"UNSUBSCRIBE_URL\":\"%s\"}", escape(request.firstName()), escape(request.lastName()), escape(request.locale()), escape(unsubscribeUrl(email, request.locale())));
            String lists = brevoListId.isBlank() ? "" : ",\"listIds\":[" + Integer.parseInt(brevoListId) + "]";
            String json = "{\"email\":\"" + escape(email) + "\",\"attributes\":" + names + lists + ",\"updateEnabled\":true}";
            HttpRequest call = HttpRequest.newBuilder(URI.create("https://api.brevo.com/v3/contacts")).header("api-key", brevoApiKey).header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(json)).build();
            HttpClient.newHttpClient().send(call, HttpResponse.BodyHandlers.discarding());
        } catch (Exception ignored) { /* Local subscription remains authoritative and can be retried. */ }
    }

    private void sendWelcomeEmail(NewsletterSubscribeRequest request, String email) {
        if (brevoApiKey.isBlank() || senderEmail.isBlank() || unsubscribeSecret.isBlank()) return;

        try {
            boolean french = "fr".equals(request.locale());
            String firstName = normalizeName(request.firstName());
            String greeting = firstName == null
                    ? (french ? "Bonjour," : "Hello,")
                    : (french ? "Bonjour " : "Hello ") + htmlEscape(firstName) + ",";
            String subject = french ? "Bienvenue chez ShareHope" : "Welcome to ShareHope";
            String heading = french ? "Bienvenue dans la communauté ShareHope" : "Welcome to the ShareHope community";
            String intro = french
                    ? "Merci de vous être inscrit(e) aux nouvelles de ShareHope."
                    : "Thank you for signing up for ShareHope updates.";
            String updates = french
                    ? "Vous recevrez des nouvelles du terrain, des témoignages des communautés que nous accompagnons et des façons de contribuer à un changement durable."
                    : "You’ll receive meaningful updates from the field, stories from the communities we serve, and ways to help create lasting change.";
            String signoff = french ? "Avec espoir,<br>L’équipe ShareHope" : "With hope,<br>The ShareHope Team";
            String unsubscribeLabel = french ? "Se désabonner" : "Unsubscribe";
            String reason = french
                    ? "Vous recevez cet e-mail parce que vous vous êtes inscrit(e) aux nouvelles de ShareHope."
                    : "You’re receiving this email because you subscribed to ShareHope updates.";
            String unsubscribe = unsubscribeUrl(email, request.locale());
            String html = "<div style=\"background:#f7f3e9;padding:32px 16px;font-family:Arial,sans-serif;color:#17324d\">"
                    + "<div style=\"max-width:600px;margin:auto;background:#fff;padding:36px;border-radius:12px\">"
                    + "<p style=\"margin-top:0\">" + greeting + "</p>"
                    + "<h1 style=\"font-family:Georgia,serif;font-size:30px\">" + heading + "</h1>"
                    + "<p style=\"line-height:1.7\">" + intro + "</p>"
                    + "<p style=\"line-height:1.7\">" + updates + "</p>"
                    + "<p style=\"line-height:1.7\">" + signoff + "</p>"
                    + "<p><a href=\"" + publicUrl + "\" style=\"color:#17324d\">sharehopeforall.org</a></p>"
                    + "<hr style=\"border:0;border-top:1px solid #ddd;margin:28px 0\">"
                    + "<p style=\"font-size:12px;color:#64748b;line-height:1.5\">" + reason
                    + " <a href=\"" + unsubscribe + "\" style=\"color:#64748b\">" + unsubscribeLabel + "</a>.</p>"
                    + "</div></div>";
            String json = "{\"sender\":{\"name\":\"ShareHope\",\"email\":\"" + escape(senderEmail)
                    + "\"},\"to\":[{\"email\":\"" + escape(email) + "\"}],\"subject\":\""
                    + escape(subject) + "\",\"htmlContent\":\"" + escape(html) + "\"}";
            HttpRequest call = HttpRequest.newBuilder(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("api-key", brevoApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();
            HttpClient.newHttpClient().sendAsync(call, HttpResponse.BodyHandlers.discarding());
        } catch (Exception ignored) { /* A welcome-email failure must not block signup. */ }
    }

    private String escape(String value) {
        return value == null ? "" : value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
    private String htmlEscape(String value) {
        return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
    }
    private String unsubscribeUrl(String email,String locale)throws Exception{long expires=java.time.Instant.now().plus(java.time.Duration.ofDays(400)).getEpochSecond();javax.crypto.Mac mac=javax.crypto.Mac.getInstance("HmacSHA256");mac.init(new javax.crypto.spec.SecretKeySpec(unsubscribeSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8),"HmacSHA256"));String signature=java.util.HexFormat.of().formatHex(mac.doFinal((email+"."+expires).getBytes(java.nio.charset.StandardCharsets.UTF_8)));return publicUrl+"/"+("fr".equals(locale)?"fr":"en")+"/unsubscribe?email="+java.net.URLEncoder.encode(email,java.nio.charset.StandardCharsets.UTF_8)+"&expires="+expires+"&signature="+signature;}

    @Transactional public void unsubscribe(String rawEmail) {
        String email=rawEmail.trim().toLowerCase(Locale.ROOT);repository.findByEmailIgnoreCase(email).ifPresent(repository::delete);
        if(!brevoApiKey.isBlank())try{HttpRequest call=HttpRequest.newBuilder(URI.create("https://api.brevo.com/v3/contacts/"+java.net.URLEncoder.encode(email,java.nio.charset.StandardCharsets.UTF_8))).header("api-key",brevoApiKey).DELETE().build();HttpClient.newHttpClient().send(call,HttpResponse.BodyHandlers.discarding());}catch(Exception ignored){}
    }
    public java.util.List<NewsletterSubscriber> list(){return repository.findAll();}

    private String normalizeName(String value) {
        if (value == null || value.isBlank()) return null;
        return value.trim();
    }
}
