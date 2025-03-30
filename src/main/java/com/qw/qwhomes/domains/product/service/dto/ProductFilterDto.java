package com.qw.qwhomes.domains.product.service.dto;

import lombok.Data;

@Data
public class ProductFilterDto {
    private String familyFilter;
    private String subFamilyFilter;
    private Long priceMin;
    private Long priceMax;
    private String colourFilter;
    private String materialFilter;
    private String supplierFilter;
    private Double dimensionHeight;
    private Double dimensionLength;
    private Double dimensionWidth;
}
