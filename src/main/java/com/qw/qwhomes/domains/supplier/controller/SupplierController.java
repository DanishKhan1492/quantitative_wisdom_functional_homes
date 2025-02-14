package com.qw.qwhomes.domains.supplier.controller;

import com.qw.qwhomes.common.dto.PageableResponse;
import com.qw.qwhomes.domains.supplier.service.SupplierService;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierDashboardDTO;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierRequestDTO;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierResponseDTO;
import com.qw.qwhomes.domains.supplier.service.impl.SupplierExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
@Tag(name = "Supplier Management", description = "APIs for managing suppliers")
public class SupplierController {

    private final SupplierService supplierService;
    private final SupplierExportService supplierExportService;
    private final MessageSource messageSource;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Create a new supplier")
    public ResponseEntity<SupplierResponseDTO> createSupplier(@Valid @RequestBody SupplierRequestDTO supplierRequestDTO) {
        SupplierResponseDTO createdSupplier = supplierService.createSupplier(supplierRequestDTO);
        String successMessage = messageSource.getMessage("supplier.created", new Object[]{createdSupplier.getId()}, LocaleContextHolder.getLocale());
        return ResponseEntity.status(HttpStatus.CREATED).header("X-Message", successMessage).body(createdSupplier);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get a supplier by ID")
    public ResponseEntity<SupplierResponseDTO> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all suppliers with pagination and search")
    public ResponseEntity<PageableResponse<SupplierResponseDTO>> getAllSuppliers(
            Pageable pageable,
            @RequestParam(required = false) Map<String,String> queryParams) {
        return ResponseEntity.ok(new PageableResponse<>(supplierService.getAllSuppliers(pageable, queryParams)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Update an existing supplier")
    public ResponseEntity<SupplierResponseDTO> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody SupplierRequestDTO supplierRequestDTO) {
        SupplierResponseDTO updatedSupplier = supplierService.updateSupplier(id, supplierRequestDTO);
        String successMessage = messageSource.getMessage("supplier.updated", new Object[]{updatedSupplier.getId()}, LocaleContextHolder.getLocale());
        return ResponseEntity.ok().header("X-Message", successMessage).body(updatedSupplier);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a supplier")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        String successMessage = messageSource.getMessage("supplier.deleted", new Object[]{id}, LocaleContextHolder.getLocale());
        return ResponseEntity.noContent().header("X-Message", successMessage).build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PatchMapping("/{id}")
    @Operation(summary = "Update the status of a supplier")
    public ResponseEntity<Void> updateSupplierStatus(@PathVariable("id") Long supplierId,@RequestParam("status") boolean status){
        supplierService.updateSupplierStatus(supplierId, status);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/metadata")
    @Operation(summary = "Get metadata of suppliers", description = "Get total suppliers, active suppliers and inactive suppliers required for dashboard")
    public ResponseEntity<SupplierDashboardDTO> getSuppliersMetaData() {
        return ResponseEntity.ok(supplierService.getSuppliersMetaData());
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/export/excel")
    public ResponseEntity<InputStreamResource> exportToExcel() throws IOException {
        ByteArrayInputStream in = supplierExportService.exportToExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=suppliers.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/export/csv")
    public ResponseEntity<InputStreamResource> exportToCsv() throws IOException {
        ByteArrayInputStream in = supplierExportService.exportToCsv();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=suppliers.csv");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(in));
    }
}
