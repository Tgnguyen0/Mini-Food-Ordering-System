package iuh.fit.se.user_service_onlinefood.dto;

import iuh.fit.se.user_service_onlinefood.entity.Role;

public record UserResponse(Long id, String username, Role role) {}