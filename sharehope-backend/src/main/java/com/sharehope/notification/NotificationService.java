package com.sharehope.notification;

import com.sharehope.donation.model.Donation;
import com.sharehope.donation.service.DonationManageTokenService;
import com.sharehope.user.model.User;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Locale;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {
    private final DonationManageTokenService manageTokens;

    public NotificationService(DonationManageTokenService manageTokens) {
        this.manageTokens = manageTokens;
    }
    @Value("${app.brevo.api-key:}") String key;
    @Value("${app.notifications.admin-email:}") String admin;
    @Value("${app.notifications.sender-email:}") String sender;
    @Value("${app.public-url:https://www.sharehopeforall.org}") String site;

    public void sendAdminAlert(String subject, String adminPath) {
        if (key.isBlank() || admin.isBlank() || sender.isBlank()) return;
        String text = "A new item is ready for review in the protected ShareHope admin portal: " + site + adminPath;
        send(admin, subject, null, text);
    }

    public boolean sendDonationConfirmation(Donation donation) {
        if (donation.getDonorEmail() == null || donation.getDonorEmail().isBlank()) return false;
        String name = donation.getDonorName() == null || donation.getDonorName().isBlank() ? "Friend" : donation.getDonorName().trim();
        String currency = donation.getCurrency() == null ? "USD" : donation.getCurrency().toUpperCase(Locale.ROOT);
        String amount = String.format(Locale.US, "%.2f %s", donation.getAmountCents() / 100.0, currency);
        String designation = donation.getDesignation() == null || donation.getDesignation().isBlank()
                ? "ShareHope programs" : donation.getDesignation().replace('-', ' ');
        String receipt = donation.getReceiptUrl() == null || donation.getReceiptUrl().isBlank() ? ""
                : "<p style=\"margin:24px 0\"><a href=\"" + html(donation.getReceiptUrl()) + "\" style=\"display:inline-block;background:#FFC72C;color:#102F4F;padding:13px 20px;text-decoration:none;font-weight:700;border-radius:6px\">View your receipt</a></p>";
        String manage = "Monthly".equalsIgnoreCase(donation.getFrequency())
                ? "<p style=\"margin:24px 0\"><a href=\"" + html(site + "/en/donate/manage?token=" + manageTokens.create(donation)) + "\" style=\"color:#17324D;font-weight:700\">Manage or cancel your monthly donation</a></p>"
                : "";
        String body = "<div style=\"background:#F7F3E9;padding:32px 16px;font-family:Arial,sans-serif;color:#17324D\">"
                + "<div style=\"max-width:600px;margin:auto;background:#FFFFFF;padding:36px;border-radius:12px\">"
                + "<p style=\"margin-top:0\">Hello " + html(name) + ",</p>"
                + "<h1 style=\"font-family:Georgia,serif;font-size:30px;line-height:1.2\">Thank you for giving hope.</h1>"
                + "<p style=\"line-height:1.7\">Your donation to ShareHope was received successfully. Your generosity helps communities build brighter, more independent futures.</p>"
                + "<div style=\"background:#F8FAFC;border-left:4px solid #FFC72C;padding:18px 20px;margin:24px 0\">"
                + "<p style=\"margin:0 0 8px\"><strong>Amount:</strong> " + html(amount) + "</p>"
                + "<p style=\"margin:0 0 8px\"><strong>Giving:</strong> " + html(donation.getFrequency()) + "</p>"
                + "<p style=\"margin:0\"><strong>Supports:</strong> " + html(designation) + "</p></div>"
                + receipt
                + manage
                + "<p style=\"line-height:1.7\">With gratitude,<br><strong>The ShareHope Team</strong></p>"
                + "<p><a href=\"" + html(site) + "\" style=\"color:#17324D\">sharehopeforall.org</a></p>"
                + "<hr style=\"border:0;border-top:1px solid #E2E8F0;margin:28px 0\">"
                + "<p style=\"font-size:12px;color:#64748B;line-height:1.5\">This transactional email confirms a donation made using this email address. Questions? Contact info@sharehopeforall.org.</p>"
                + "</div></div>";
        return send(donation.getDonorEmail(), "Thank you for your donation to ShareHope", body, null);
    }

    public boolean sendDonationCancellation(Donation donation) {
        if (donation.getDonorEmail() == null || donation.getDonorEmail().isBlank()) return false;
        boolean scheduled = "Cancellation scheduled".equalsIgnoreCase(donation.getSubscriptionStatus());
        String heading = scheduled ? "Your monthly donation cancellation is scheduled." : "Your monthly donation has been cancelled.";
        String explanation = scheduled
                ? "Your current billing period remains active, but no additional recurring payments will be collected."
                : "No additional recurring payments will be collected for this ShareHope donation.";
        String body = "<div style=\"background:#F7F3E9;padding:32px 16px;font-family:Arial,sans-serif;color:#17324D\">"
                + "<div style=\"max-width:600px;margin:auto;background:#FFFFFF;padding:36px;border-radius:12px\">"
                + "<h1 style=\"font-family:Georgia,serif\">" + heading + "</h1>"
                + "<p style=\"line-height:1.7\">" + explanation + "</p>"
                + "<p style=\"line-height:1.7\">Thank you for the hope you have shared.<br><strong>The ShareHope Team</strong></p>"
                + "<p style=\"font-size:12px;color:#64748B\">Questions? Contact info@sharehopeforall.org.</p>"
                + "</div></div>";
        return send(donation.getDonorEmail(), scheduled
                ? "Your ShareHope monthly donation cancellation is scheduled"
                : "Your ShareHope monthly donation was cancelled", body, null);
    }

    @org.springframework.scheduling.annotation.Async
    public void sendAdminInvitation(User user, String token) {
        String url = site + "/en/admin/activate?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
        String text = "Hello " + user.getFirstName() + ",\n\nYou were invited to the ShareHope administration portal. Create your password within 48 hours:\n" + url + "\n\nIf you were not expecting this invitation, ignore this email.";
        send(user.getEmail(), "Your ShareHope administrator invitation", null, text);
    }

    @org.springframework.scheduling.annotation.Async
    public void sendPasswordReset(User user, String token) {
        String url = site + "/en/admin/reset-password?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
        String text = "Hello " + user.getFirstName() + ",\n\nUse this link to reset your ShareHope administrator password. It expires in 30 minutes:\n" + url + "\n\nIf you did not request this, ignore this email.";
        send(user.getEmail(), "Reset your ShareHope password", null, text);
    }

    private boolean send(String recipient, String subject, String htmlContent, String textContent) {
        if (key.isBlank() || sender.isBlank() || recipient == null || recipient.isBlank()) {
            log.warn("Email not sent because Brevo or sender configuration is missing");
            return false;
        }
        try {
            String content = htmlContent != null ? ",\"htmlContent\":\"" + json(htmlContent) + "\""
                    : ",\"textContent\":\"" + json(textContent) + "\"";
            String payload = "{\"sender\":{\"name\":\"ShareHope\",\"email\":\"" + json(sender)
                    + "\"},\"to\":[{\"email\":\"" + json(recipient) + "\"}],\"subject\":\""
                    + json(subject) + "\"" + content + "}";
            HttpRequest request = HttpRequest.newBuilder(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("api-key", key).header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(payload)).build();
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) return true;
            log.error("Brevo email rejected with status {}: {}", response.statusCode(), response.body());
        } catch (Exception error) {
            log.error("Brevo email request failed", error);
        }
        return false;
    }

    private String json(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }

    private String html(String value) {
        return value == null ? "" : value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#39;");
    }
}
