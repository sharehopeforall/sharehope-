package com.sharehope.auth.controller;

import com.sharehope.auth.dto.LoginRequest;
import com.sharehope.auth.dto.LoginResponse;
import com.sharehope.auth.service.AuthService;
import com.sharehope.auth.service.LoginAttemptService;
import com.sharehope.user.dto.ActivateUserRequest;
import com.sharehope.user.model.User;
import com.sharehope.user.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final LoginAttemptService loginAttemptService;

    public AuthController(AuthService authService, UserRepository userRepository, LoginAttemptService loginAttemptService) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.loginAttemptService = loginAttemptService;
    }

    @PostMapping("/activate")
    public ResponseEntity<?> activate(
            @Valid @RequestBody ActivateUserRequest request
    ) {

        User user = authService.activateUser(request);

        return ResponseEntity.ok(Map.of(
                "message", "Account activated successfully",
                "userId", user.getId(),
                "email", user.getEmail(),
                "status", user.getStatus().name()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        String key = httpRequest.getRemoteAddr() + ":" + request.email().trim().toLowerCase();
        loginAttemptService.checkAllowed(key);
        try {
            LoginResponse response = authService.login(request);
            loginAttemptService.recordSuccess(key);
            return ResponseEntity.ok(response);
        } catch (RuntimeException exception) {
            loginAttemptService.recordFailure(key);
            throw exception;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<LoginResponse> me(@AuthenticationPrincipal Jwt jwt) {
        User user = userRepository.findById(java.util.UUID.fromString(jwt.getSubject()))
                .filter(candidate -> candidate.getStatus() == com.sharehope.user.model.UserStatus.ACTIVE)
                .orElseThrow(() -> new com.sharehope.exception.InvalidCredentialsException("Authenticated user not found."));
        String role = user.getRoles().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("User does not have an assigned role."))
                .getName();
        return ResponseEntity.ok(new LoginResponse(
                null, "Bearer", 0, user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), role
        ));
    }
}
