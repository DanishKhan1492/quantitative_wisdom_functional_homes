package com.qw.qwhomes.domains.product.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String sku;
    private Long familyId;
    private Long subfamilyId;
    private BigDecimal height;
    private BigDecimal length;
    private BigDecimal width;
    private BigDecimal price;
    private BigDecimal discount;
    private Long supplierId;
    private String status;
    private String description;
    private String images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy;
    private Long updatedBy;
}
