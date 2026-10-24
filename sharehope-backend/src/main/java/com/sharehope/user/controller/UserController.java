package com.sharehope.user.controller;

import com.sharehope.exception.ResourceNotFoundException;
import com.sharehope.user.dto.InviteUserRequest;
import com.sharehope.user.model.User;
import com.sharehope.user.repository.UserRepository;
import com.sharehope.user.service.InviteUserResult;
import com.sharehope.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/invite")
    public ResponseEntity<?> inviteUser(
            @Valid @RequestBody InviteUserRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {

        User invitedBy = currentUser(jwt);

        InviteUserResult result =
                userService.inviteUser(request, invitedBy);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "User invited successfully",
                        "userId", result.user().getId(),
                        "email", result.user().getEmail(),
                        "status", result.user().getStatus().name(),
                        "role", request.role().name(),
                        "invitationToken", result.rawToken()
                ));
    }

    private User currentUser(Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found."
                        )
                );
    }
}
