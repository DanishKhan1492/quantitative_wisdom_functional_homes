package com.qw.qwhomes.domains.product.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.qw.qwhomes.domains.colour.service.dto.ColourDTO;
import com.qw.qwhomes.domains.material.service.dto.MaterialDTO;
import com.qw.qwhomes.domains.product.data.entity.ProductStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long productId;

    @NotBlank(message = "{product.name.notBlank}")
    private String name;

    @NotBlank(message = "{product.sku.notBlank}")
    private String sku;

    @NotNull(message = "{product.height.notNull}")
    @Positive(message = "{product.height.positive}")
    private Double height;

    @NotNull(message = "{product.length.notNull}")
    @Positive(message = "{product.length.positive}")
    private Double length;

    @NotNull(message = "{product.width.notNull}")
    @Positive(message = "{product.width.positive}")
    private Double width;

    @NotNull(message = "{product.price.notNull}")
    @Positive(message = "{product.price.positive}")
    private Double price;

    @DecimalMin(value = "0.0", message = "{product.discount.min}")
    @DecimalMax(value = "100.0", message = "{product.discount.max}")
    private Double discount;

    private ProductStatus status;
    private String description;
    private String images;
    
    @NotNull(message = "{product.family.notNull}")
    private Long familyId;
    
    @NotNull(message = "{product.subfamily.notNull}")
    private Long subFamilyId;
    
    @NotNull(message = "{product.supplier.notNull}")
    private Long supplierId;

    @NotNull(message = "{product.colours.notNull}")
    @NotEmpty(message = "{product.colours.notEmpty}")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<Long> colourIds;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String familyName;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String subFamilyName;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String supplierName;

    @NotNull(message = "{product.materials.notNull}")
    @NotEmpty(message = "{product.materials.notEmpty}")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<Long> materialIds;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<ColourDTO> colours;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<MaterialDTO> materials;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<byte[]> allImages;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long createdBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime updatedAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long updatedBy;
}
