package com.sharehope.auth.service;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TotpService {
    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    private final SecureRandom random = new SecureRandom();
    private final SecretKeySpec encryptionKey;

    public TotpService(@Value("${app.jwt.secret}") String applicationSecret) {
        try {
            byte[] key = MessageDigest.getInstance("SHA-256").digest(applicationSecret.getBytes(StandardCharsets.UTF_8));
            this.encryptionKey = new SecretKeySpec(key, "AES");
        } catch (Exception error) {
            throw new IllegalStateException("Unable to initialize MFA encryption", error);
        }
    }

    public String generateSecret() {
        byte[] bytes = new byte[20];
        random.nextBytes(bytes);
        return base32Encode(bytes);
    }

    public boolean verify(String secret, String code) {
        if (code == null || !code.matches("^[0-9]{6}$")) return false;
        long counter = Instant.now().getEpochSecond() / 30;
        for (long offset = -1; offset <= 1; offset++) {
            if (generateCode(base32Decode(secret), counter + offset).equals(code)) return true;
        }
        return false;
    }

    public String encrypt(String secret) {
        try {
            byte[] iv = new byte[12]; random.nextBytes(iv);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, encryptionKey, new GCMParameterSpec(128, iv));
            byte[] encrypted = cipher.doFinal(secret.getBytes(StandardCharsets.UTF_8));
            ByteBuffer packed = ByteBuffer.allocate(iv.length + encrypted.length).put(iv).put(encrypted);
            return Base64.getUrlEncoder().withoutPadding().encodeToString(packed.array());
        } catch (Exception error) { throw new IllegalStateException("Unable to protect MFA secret", error); }
    }

    public String decrypt(String encrypted) {
        try {
            byte[] packed = Base64.getUrlDecoder().decode(encrypted);
            byte[] iv = java.util.Arrays.copyOfRange(packed, 0, 12);
            byte[] value = java.util.Arrays.copyOfRange(packed, 12, packed.length);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, encryptionKey, new GCMParameterSpec(128, iv));
            return new String(cipher.doFinal(value), StandardCharsets.UTF_8);
        } catch (Exception error) { throw new IllegalStateException("Unable to read MFA secret", error); }
    }

    private String generateCode(byte[] secret, long counter) {
        try {
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(new SecretKeySpec(secret, "HmacSHA1"));
            byte[] hash = mac.doFinal(ByteBuffer.allocate(8).putLong(counter).array());
            int offset = hash[hash.length - 1] & 15;
            int binary = ((hash[offset] & 127) << 24) | ((hash[offset + 1] & 255) << 16)
                    | ((hash[offset + 2] & 255) << 8) | (hash[offset + 3] & 255);
            return String.format("%06d", binary % 1_000_000);
        } catch (Exception error) { throw new IllegalStateException("Unable to verify MFA code", error); }
    }

    private String base32Encode(byte[] data) {
        StringBuilder result = new StringBuilder(); int buffer = 0, bits = 0;
        for (byte value : data) { buffer = (buffer << 8) | (value & 255); bits += 8; while (bits >= 5) { result.append(ALPHABET.charAt((buffer >> (bits -= 5)) & 31)); } }
        if (bits > 0) result.append(ALPHABET.charAt((buffer << (5 - bits)) & 31));
        return result.toString();
    }

    private byte[] base32Decode(String value) {
        java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream(); int buffer = 0, bits = 0;
        for (char c : value.toUpperCase().toCharArray()) { int index = ALPHABET.indexOf(c); if (index < 0) continue; buffer = (buffer << 5) | index; bits += 5; if (bits >= 8) out.write((buffer >> (bits -= 8)) & 255); }
        return out.toByteArray();
    }
}
