package com.qw.qwhomes.domains.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductCreateDTO {
    @NotBlank(message = "{product.name.notBlank}")
    private String name;

    @NotBlank(message = "{product.sku.notBlank}")
    private String sku;

    private Long familyId;
    private Long subFamilyId;

    @Positive(message = "{product.height.positive}")
    private BigDecimal height;

    @Positive(message = "{product.length.positive}")
    private BigDecimal length;

    @Positive(message = "{product.width.positive}")
    private BigDecimal width;

    @NotNull(message = "{product.price.notNull}")
    @Positive(message = "{product.price.positive}")
    private BigDecimal price;

    @Positive(message = "{product.discount.positive}")
    private BigDecimal discount;

    private Long supplierId;
    private String status;
    private String description;
    private String images;

    private LocalDateTime createdAt;

    private Long createdBy;

    private LocalDateTime updatedAt;

    private Long updatedBy;
}
