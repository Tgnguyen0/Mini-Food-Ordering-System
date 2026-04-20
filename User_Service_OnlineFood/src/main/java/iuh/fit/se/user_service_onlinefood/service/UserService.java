package iuh.fit.se.user_service_onlinefood.service;

import iuh.fit.se.user_service_onlinefood.dto.AuthResponse;
import iuh.fit.se.user_service_onlinefood.dto.LoginRequest;
import iuh.fit.se.user_service_onlinefood.dto.RegisterRequest;
import iuh.fit.se.user_service_onlinefood.dto.UserResponse;

import java.util.List;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    List<UserResponse> getAllUsers();
}

