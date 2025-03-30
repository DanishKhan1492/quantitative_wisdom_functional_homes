package com.qw.qwhomes.domains.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RoleDto {
    private Long id;
    private String name;
    private String description;
}
