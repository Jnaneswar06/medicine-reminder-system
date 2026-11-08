package com.jnaneswar.medicinereminder.service;

import com.jnaneswar.medicinereminder.dto.AuthResponse;
import com.jnaneswar.medicinereminder.dto.LoginRequest;
import com.jnaneswar.medicinereminder.dto.RegisterRequest;
import com.jnaneswar.medicinereminder.dto.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
