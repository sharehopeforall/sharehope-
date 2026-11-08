package com.sharehope.auth.controller;

import com.sharehope.auth.dto.LoginRequest;
import com.sharehope.auth.dto.LoginResponse;
import com.sharehope.auth.dto.ForgotPasswordRequest;
import com.sharehope.auth.dto.ResetPasswordRequest;
import com.sharehope.auth.dto.ChangePasswordRequest;
import com.sharehope.auth.dto.ChangeEmailRequest;
import com.sharehope.auth.dto.MfaCodeRequest;
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
        String accountKey = "login:account:" + request.email().trim().toLowerCase();
        loginAttemptService.checkAllowed(accountKey);
        try {
            LoginResponse response = authService.login(request);
            loginAttemptService.recordSuccess(accountKey);
            return ResponseEntity.ok(response);
        } catch (RuntimeException exception) {
            loginAttemptService.recordFailure(accountKey);
            throw exception;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal Jwt jwt) {
        authService.logout(java.util.UUID.fromString(jwt.getSubject()));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request, HttpServletRequest httpRequest) {
        String key = "recovery:" + httpRequest.getRemoteAddr() + ":" + request.email().trim().toLowerCase();
        loginAttemptService.checkAllowed(key);
        loginAttemptService.recordFailure(key);
        authService.requestPasswordReset(request.email());
        return ResponseEntity.ok(Map.of("message", "If an active account exists, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully."));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(java.util.UUID.fromString(jwt.getSubject()), request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/change-email")
    public ResponseEntity<Void> changeEmail(
            @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ChangeEmailRequest request) {
        authService.changeEmail(java.util.UUID.fromString(jwt.getSubject()), request);
        return ResponseEntity.noContent().build();
    }

    @org.springframework.web.bind.annotation.GetMapping("/mfa/status")
    public ResponseEntity<Map<String, Boolean>> mfaStatus(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(Map.of("enabled", authService.mfaEnabled(java.util.UUID.fromString(jwt.getSubject()))));
    }

    @PostMapping("/mfa/setup")
    public ResponseEntity<Map<String, Object>> setupMfa(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(authService.beginMfaSetup(java.util.UUID.fromString(jwt.getSubject())));
    }

    @PostMapping("/mfa/enable")
    public ResponseEntity<Void> enableMfa(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody MfaCodeRequest request) {
        authService.enableMfa(java.util.UUID.fromString(jwt.getSubject()), request.code());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/mfa/disable")
    public ResponseEntity<Void> disableMfa(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody MfaCodeRequest request) {
        authService.disableMfa(java.util.UUID.fromString(jwt.getSubject()), request.code());
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
