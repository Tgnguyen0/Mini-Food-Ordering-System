package iuh.fit.se.user_service_onlinefood.dto;

import iuh.fit.se.user_service_onlinefood.entity.Role;

public record AuthResponse(String token, String username, Role role) {}