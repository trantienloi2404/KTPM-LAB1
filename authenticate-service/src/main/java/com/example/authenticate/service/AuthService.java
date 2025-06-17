package com.example.authenticate.service;

import com.example.authenticate.dto.AuthRequestDTO;
import com.example.authenticate.entity.User;
import com.example.authenticate.repository.UserRepository;
import com.example.authenticate.response.ApiResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository repo, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public ApiResponse<String> register(AuthRequestDTO request) {
        if (repo.findByUsername(request.getUsername()).isPresent()) {
            return new ApiResponse<>(409, "Username already exists", null); // Conflict
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encode password

        User saved = repo.save(user);
        String token = jwtService.generateToken(saved.getUsername());
        return new ApiResponse<>(201, "Registered successfully", token); // Created
    }

    public ApiResponse<String> login(AuthRequestDTO request) {
        return repo.findByUsername(request.getUsername())
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> {
                    String token = jwtService.generateToken(user.getUsername());
                    return new ApiResponse<>(200, "Login successful", token); // OK
                })
                .orElse(new ApiResponse<>(401, "Invalid credentials", null)); // Unauthorized
    }
}

