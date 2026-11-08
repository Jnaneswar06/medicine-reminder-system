package com.jnaneswar.medicinereminder.controller;

import com.jnaneswar.medicinereminder.dto.AuthResponse;
import com.jnaneswar.medicinereminder.dto.LoginRequest;
import com.jnaneswar.medicinereminder.dto.RegisterRequest;
import com.jnaneswar.medicinereminder.dto.UserResponse;
import com.jnaneswar.medicinereminder.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
