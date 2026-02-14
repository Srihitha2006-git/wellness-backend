package com.wellness.backend.dto;

import lombok.Data;
@Data
public class AuthResponseDTO {

    private String accessToken;
    private String refreshToken;
    private Object user; // Use UserDTO to avoid exposing entity
}