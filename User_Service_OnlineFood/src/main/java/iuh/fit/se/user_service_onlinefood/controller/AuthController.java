package iuh.fit.se.user_service_onlinefood.controller;

import iuh.fit.se.user_service_onlinefood.dto.AuthResponse;
import iuh.fit.se.user_service_onlinefood.dto.LoginRequest;
import iuh.fit.se.user_service_onlinefood.dto.RegisterRequest;
import iuh.fit.se.user_service_onlinefood.dto.UserResponse;
import iuh.fit.se.user_service_onlinefood.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/users")
    // @PreAuthorize("hasAuthority('ADMIN')") // Mở comment nếu chỉ ADMIN mới được xem danh sách
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}