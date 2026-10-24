package com.sharehope.user.service;

import com.sharehope.user.model.User;

public record InviteUserResult(
        User user,
        String rawToken
) {}
