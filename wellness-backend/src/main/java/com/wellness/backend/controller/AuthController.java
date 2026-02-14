package com.wellness.backend.controller;

import com.wellness.backend.dto.AuthResponseDTO;
import com.wellness.backend.dto.UserLoginDTO;
import com.wellness.backend.dto.UserRegisterDTO;
import com.wellness.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ================= REGISTER NEW USER =================
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registerUser(
            @Valid @RequestBody UserRegisterDTO registerDTO) {

        AuthResponseDTO response = authService.registerUser(registerDTO);
        return ResponseEntity.ok(response);
    }

    // ================= LOGIN EXISTING USER =================
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> loginUser(
            @Valid @RequestBody UserLoginDTO loginDTO) {

        AuthResponseDTO response = authService.loginUser(loginDTO);
        return ResponseEntity.ok(response);
    }

    // ================= REFRESH ACCESS TOKEN =================
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refreshToken(
            @RequestParam String refreshToken) {

        AuthResponseDTO response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }
}