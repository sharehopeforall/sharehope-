package com.sharehope.auth.controller;

import com.sharehope.auth.dto.LoginRequest;
import com.sharehope.auth.dto.LoginResponse;
import com.sharehope.auth.service.AuthService;
import com.sharehope.user.dto.ActivateUserRequest;
import com.sharehope.user.model.User;
import jakarta.validation.Valid;
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

    public AuthController(AuthService authService) {
        this.authService = authService;
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
            @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.login(request)
        );
    }
}
