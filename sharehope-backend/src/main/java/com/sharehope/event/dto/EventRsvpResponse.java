package com.sharehope.event.dto;

import java.util.UUID;

public record EventRsvpResponse(UUID registrationId, boolean success) {}
