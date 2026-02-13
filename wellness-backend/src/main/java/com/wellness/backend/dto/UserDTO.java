package com.wellness.backend.dto;

import com.wellness.backend.model.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Integer id;
    private String name;
    private String email;
    private String bio;
    private User.Role role;
    private LocalDateTime createdAt;
}
