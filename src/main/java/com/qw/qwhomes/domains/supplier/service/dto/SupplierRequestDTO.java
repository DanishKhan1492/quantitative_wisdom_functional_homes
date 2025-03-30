package com.qw.qwhomes.domains.supplier.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SupplierRequestDTO {

    @NotBlank(message = "{supplier.name.not.blank}")
    @Size(max = 255, message = "{supplier.name.size}")
    private String name;

    @NotBlank(message = "{supplier.email.not.blank}")
    @Email(message = "{supplier.email.invalid}")
    private String email;

    @NotBlank(message = "{supplier.phone.not.blank}")
    private String phoneNumber;

    @Size(max = 50)
    private String businessRegistrationNumber;

    @Size(max = 100)
    private String primaryContactName;

    @Size(max = 100)
    private String primaryContactPosition;

    @Size(max = 20)
    private String secondaryContactNumber;

    @Size(max = 255)
    private String websiteUrl;

    @Size(max = 255)
    private String streetAddress1;

    @Size(max = 255)
    private String streetAddress2;

    @Size(max = 100)
    private String city;

    @Size(max = 100)
    private String stateProvince;

    @Size(max = 100)
    private String country;

    @Size(max = 100)
    private String paymentTerms;

    private boolean assemblyServices;

    private Integer deliveryTimeWeeks;

    private Integer taxNumber;

    private Integer supplierDiscount;

    private boolean status;

    @JsonIgnore
    private Long createdBy;

    @JsonIgnore
    private Long updatedBy;
}
