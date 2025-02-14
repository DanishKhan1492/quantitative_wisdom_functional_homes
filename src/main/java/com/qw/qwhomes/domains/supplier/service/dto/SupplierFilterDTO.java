package com.qw.qwhomes.domains.supplier.service.dto;

import lombok.Data;

@Data
public class SupplierFilterDTO {

    private String name;
    private String businessRegistrationNumber;
    private String city;
    private String country;
}
