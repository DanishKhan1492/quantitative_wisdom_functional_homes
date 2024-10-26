package com.qw.qwhomes.domains.product.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductUpdateDTO {
    private String name;
    private Long familyId;
    private Long subFamilyId;

    @Positive(message = "{product.height.positive}")
    private BigDecimal height;

    @Positive(message = "{product.length.positive}")
    private BigDecimal length;

    @Positive(message = "{product.width.positive}")
    private BigDecimal width;

    @Positive(message = "{product.price.positive}")
    private BigDecimal price;

    @Positive(message = "{product.discount.positive}")
    private BigDecimal discount;

    private Long supplierId;
    private String status;
    private String description;
    private String images;
}
