package com.sharehope.auth.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class LoginAttemptServiceTest {
    @Test
    void blocksAfterFiveFailuresAndResetsAfterSuccess() {
        LoginAttemptService service = new LoginAttemptService();
        String key = "127.0.0.1:user@example.org";

        for (int attempt = 0; attempt < 5; attempt++) {
            assertThatCode(() -> service.checkAllowed(key)).doesNotThrowAnyException();
            service.recordFailure(key);
        }

        assertThatThrownBy(() -> service.checkAllowed(key))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("429");

        service.recordSuccess(key);
        assertThatCode(() -> service.checkAllowed(key)).doesNotThrowAnyException();
    }
}
