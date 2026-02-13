package com.wellness.backend.dto;

import lombok.Data;

@Data
public class PractitionerProfileDTO {
    private Integer id;
    private Integer userId;
    private String userName;
    private String email;
    private String specialization;
    private Boolean verified;
    private Float rating;
    private String qualifications;
    private String experience;
    private String bio;
}
