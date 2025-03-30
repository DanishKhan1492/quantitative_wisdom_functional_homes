package com.qw.qwhomes.domains.supplier.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SupplierDashboardDTO {
    private Long totalSuppliers;
    private Long totalActiveSuppliers;
    private Long totalInactiveSuppliers;
}
