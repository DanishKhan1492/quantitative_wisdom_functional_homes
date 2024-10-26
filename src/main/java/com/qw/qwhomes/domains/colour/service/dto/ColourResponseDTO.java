package com.qw.qwhomes.domains.colour.service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ColourResponseDTO {
    private Long id;
    private String name;
    private String code;
    private String description;
    private LocalDateTime createdAt;
    private Long createdBy;
    private LocalDateTime updatedAt;
    private Long updatedBy;
}
