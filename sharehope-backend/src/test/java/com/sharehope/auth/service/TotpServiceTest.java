package com.sharehope.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;

class TotpServiceTest {
    @Test
    void encryptsSecretsWithRandomizedAuthenticatedEncryption() {
        TotpService service = new TotpService("test-only-secret-that-is-at-least-thirty-two-characters-long");
        String secret = service.generateSecret();
        String first = service.encrypt(secret);
        String second = service.encrypt(secret);
        assertThat(first).isNotEqualTo(second);
        assertThat(service.decrypt(first)).isEqualTo(secret);
        assertThat(service.verify(secret, "not-a-code")).isFalse();
    }
}
