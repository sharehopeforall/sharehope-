package com.sharehope.donation.service;

import com.sharehope.donation.model.Donation;
import com.sharehope.donation.repository.DonationRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DonationManageTokenService {
    private final DonationRepository donations;
    private final byte[] secret;

    DonationManageTokenService(DonationRepository donations, @Value("${app.payment.internal-secret:}") String secret) {
        this.donations = donations;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
    }

    public String create(Donation donation) {
        String id = donation.getId().toString();
        return id + "." + sign(id, donation.getDonorEmail());
    }

    public Optional<Donation> verify(String token) {
        if (secret.length < 32 || token == null) return Optional.empty();
        int separator = token.indexOf('.');
        if (separator <= 0 || separator == token.length() - 1) return Optional.empty();
        try {
            UUID id = UUID.fromString(token.substring(0, separator));
            return donations.findById(id).filter(donation -> MessageDigest.isEqual(
                    token.substring(separator + 1).getBytes(StandardCharsets.UTF_8),
                    sign(id.toString(), donation.getDonorEmail()).getBytes(StandardCharsets.UTF_8)));
        } catch (IllegalArgumentException ignored) {
            return Optional.empty();
        }
    }

    private String sign(String id, String email) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            String value = id + ":" + (email == null ? "" : email.trim().toLowerCase());
            return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception error) {
            throw new IllegalStateException("Could not create donation management token", error);
        }
    }
}
