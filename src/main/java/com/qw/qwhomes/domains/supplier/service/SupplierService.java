package com.qw.qwhomes.domains.supplier.service;

import com.qw.qwhomes.domains.supplier.service.dto.SupplierDashboardDTO;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierRequestDTO;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface SupplierService {

    SupplierResponseDTO createSupplier(SupplierRequestDTO supplierRequestDTO);

    SupplierResponseDTO getSupplierById(Long id);

    Page<SupplierResponseDTO> getAllSuppliers(Pageable pageable, Map<String,String> queryParams);

    SupplierResponseDTO updateSupplier(Long id, SupplierRequestDTO supplierRequestDTO);

    void deleteSupplier(Long id);

    void updateSupplierStatus(Long supplierId, boolean status);

    SupplierDashboardDTO getSuppliersMetaData();
}
