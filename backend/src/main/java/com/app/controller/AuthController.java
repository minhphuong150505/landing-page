package com.app.controller;

import com.app.dto.ApiResponse;
import com.app.dto.LoginRequest;
import com.app.dto.LoginResponse;
import com.app.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final JwtService jwtService;
    @Value("${app.admin.username}") private String adminUsername;
    @Value("${app.admin.password}") private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest req) {
        if (!adminUsername.equals(req.getUsername()) || !adminPassword.equals(req.getPassword())) {
            return ResponseEntity.status(401).body(ApiResponse.error("Sai tên đăng nhập hoặc mật khẩu"));
        }
        String token = jwtService.generate(adminUsername);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công",
                new LoginResponse(token, jwtService.expiresAt(), adminUsername)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, String>>> me(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(ApiResponse.error("Chưa đăng nhập"));
        return ResponseEntity.ok(ApiResponse.success("OK",
                Map.of("username", auth.getName(), "role", "ADMIN")));
    }
}
