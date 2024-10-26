package com.qw.qwhomes.domains.material.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MaterialUpdateDTO {

    @Size(max = 50, message = "Name must not exceed 50 characters")
    private String name;

    @Size(max = 50, message = "Type must not exceed 50 characters")
    private String type;

    private String description;
}
