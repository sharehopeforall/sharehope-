package com.sharehope.auth.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import com.sharehope.auth.model.AuthRateLimit;
import com.sharehope.auth.repository.AuthRateLimitRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LoginAttemptServiceTest {
    @Test
    void blocksAfterFiveFailuresAndResetsAfterSuccess() {
        AuthRateLimitRepository repository = mock(AuthRateLimitRepository.class);
        Map<String, AuthRateLimit> stored = new HashMap<>();
        when(repository.findById(any())).thenAnswer(invocation -> Optional.ofNullable(stored.get(invocation.getArgument(0))));
        when(repository.findForUpdate(any())).thenAnswer(invocation -> Optional.ofNullable(stored.get(invocation.getArgument(0))));
        when(repository.save(any())).thenAnswer(invocation -> {
            AuthRateLimit value = invocation.getArgument(0); stored.put(value.getRateKey(), value); return value;
        });
        doAnswer(invocation -> stored.remove(invocation.getArgument(0))).when(repository).deleteById(any());
        LoginAttemptService service = new LoginAttemptService(repository);
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
