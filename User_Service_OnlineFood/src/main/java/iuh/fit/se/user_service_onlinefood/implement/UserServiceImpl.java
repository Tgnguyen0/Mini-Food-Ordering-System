package iuh.fit.se.user_service_onlinefood.implement;

import iuh.fit.se.user_service_onlinefood.dto.AuthResponse;
import iuh.fit.se.user_service_onlinefood.dto.LoginRequest;
import iuh.fit.se.user_service_onlinefood.dto.RegisterRequest;
import iuh.fit.se.user_service_onlinefood.dto.UserResponse;
import iuh.fit.se.user_service_onlinefood.entity.User;
import iuh.fit.se.user_service_onlinefood.entity.Role;
import iuh.fit.se.user_service_onlinefood.repo.UserRepository;
import iuh.fit.se.user_service_onlinefood.security.JwtUtils;
import iuh.fit.se.user_service_onlinefood.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Của Lombok
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username đã tồn tại"); // Sẽ được bắt bởi GlobalExceptionHandler
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER); // Mặc định là USER

        userRepository.save(user);

        String token = jwtUtils.generateToken(user);
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Sai tài khoản hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Sai tài khoản hoặc mật khẩu");
        }

        String token = jwtUtils.generateToken(user);
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserResponse(u.getId(), u.getUsername(), u.getRole()))
                .collect(Collectors.toList());
    }
}