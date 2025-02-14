package com.qw.qwhomes.domains.supplier.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SupplierResponseDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    private String name;
    private String businessRegistrationNumber;
    private String primaryContactName;
    private String primaryContactPosition;
    private String phoneNumber;
    private String email;
    private String secondaryContactNumber;
    private String websiteUrl;
    private String streetAddress1;
    private String streetAddress2;
    private String city;
    private String stateProvince;
    private String country;
    private String paymentTerms;
    private String assemblyServices;
    private Integer deliveryTimeWeeks;
    private Integer taxNumber;
    private Integer supplierDiscount;
    private boolean status;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long createdBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime updatedAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long updatedBy;
}
