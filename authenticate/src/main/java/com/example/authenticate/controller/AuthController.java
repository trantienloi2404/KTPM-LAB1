package com.example.authenticate.controller;

import com.example.authenticate.dto.AuthRequestDTO;
import com.example.authenticate.response.ApiResponse;
import com.example.authenticate.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @RequestBody AuthRequestDTO request,
            HttpServletResponse response) {
        ApiResponse<String> apiResponse = service.register(request);
        if (apiResponse.getData() != null) {
            setAuthCookie(response, apiResponse.getData());
        }
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(
            @RequestBody AuthRequestDTO request,
            HttpServletResponse response) {
        ApiResponse<String> apiResponse = service.login(request);
        if (apiResponse.getData() != null) {
            setAuthCookie(response, apiResponse.getData());
        }
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("auth_token", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok(new ApiResponse<>(200, "Logged out successfully", null));
    }

    private void setAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("auth_token", token);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Only send cookie over HTTPS
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        response.addCookie(cookie);
    }
}
