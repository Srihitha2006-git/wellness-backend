package com.wellness.backend.service;

import com.wellness.backend.dto.AuthResponseDTO;
import com.wellness.backend.dto.UserLoginDTO;
import com.wellness.backend.dto.UserRegisterDTO;
import com.wellness.backend.dto.UserDTO;
import com.wellness.backend.model.User;
import com.wellness.backend.repository.UserRepository;
import com.wellness.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service handling all authentication logic:
 * - User registration
 * - User login
 * - Refresh access token
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService; // For mapping User → UserDTO

    // ================= REGISTER NEW USER =================
    @Transactional
    public AuthResponseDTO registerUser(UserRegisterDTO registerDTO) {

        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        // Map DTO → Entity
        User user = new User();
        user.setName(registerDTO.getName());
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setRole(registerDTO.getRole());
        user.setBio(registerDTO.getBio());

        // Save user
        User savedUser = userRepository.save(user);

        // Generate JWT tokens using email
        String accessToken = jwtService.generateToken(savedUser.getEmail());
        String refreshToken = jwtService.generateRefreshToken(savedUser.getEmail());

        // Map Entity → DTO
        UserDTO userDTO = userService.mapToDTO(savedUser);

        // Build response
        AuthResponseDTO response = new AuthResponseDTO();
        response.setUser(userDTO);
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);

        return response;
    }

    // ================= LOGIN EXISTING USER =================
    @Transactional(readOnly = true)
    public AuthResponseDTO loginUser(UserLoginDTO loginDTO) {

        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT tokens using email
        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        // Map entity → DTO
        UserDTO userDTO = userService.mapToDTO(user);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setUser(userDTO);
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);

        return response;
    }

    // ================= REFRESH ACCESS TOKEN =================
    @Transactional(readOnly = true)
    public AuthResponseDTO refreshToken(String refreshToken) {

        // Extract email from refresh token
        String email = jwtService.extractUsername(refreshToken);

        // Validate refresh token with email
        if (!jwtService.validateToken(refreshToken, email)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for token"));

        // Generate new access token
        String newAccessToken = jwtService.generateToken(user.getEmail());

        // Map entity → DTO
        UserDTO userDTO = userService.mapToDTO(user);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setUser(userDTO);
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(refreshToken); // keep the same refresh token

        return response;
    }
}