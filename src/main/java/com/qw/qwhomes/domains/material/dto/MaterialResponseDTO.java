package com.qw.qwhomes.domains.material.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MaterialResponseDTO {

    private Long id;
    private String name;
    private String type;
    private String description;
    private LocalDateTime createdAt;
    private Long createdBy;
    private LocalDateTime updatedAt;
    private Long updatedBy;
}
