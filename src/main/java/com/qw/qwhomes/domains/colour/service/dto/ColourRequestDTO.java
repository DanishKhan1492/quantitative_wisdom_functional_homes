package com.qw.qwhomes.domains.colour.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ColourRequestDTO {
    @NotBlank(message = "{colour.name.notBlank}")
    @Size(max = 50, message = "{colour.name.size}")
    private String name;

    @Size(max = 20, message = "{colour.code.size}")
    private String code;

    private String description;
}
