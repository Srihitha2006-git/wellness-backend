package com.wellness.backend.dto;

import lombok.Data;

@Data
public class PractitionerUpdateDTO {
    private String specialization;
    private String qualifications;
    private String experience;
}
