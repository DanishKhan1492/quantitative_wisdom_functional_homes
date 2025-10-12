package com.qw.qwhomes.domains.supplier.unit_tests;

import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.domains.supplier.data.entity.Supplier;
import com.qw.qwhomes.domains.supplier.data.repository.SupplierRepository;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierRequestDTO;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierResponseDTO;
import com.qw.qwhomes.domains.supplier.service.impl.SupplierServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SupplierUnitTests {

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private SupplierServiceImpl supplierService;

    @InjectMocks
    private SupplierExportService supplierExportService;

    private Supplier supplier;
    private SupplierRequestDTO supplierDTO;

    @BeforeEach
    void setUp() {
        supplier = new Supplier();
        supplier.setId(1L);
        supplier.setName("Test Supplier");
        supplier.setBusinessRegistrationNumber("BR123456");
        supplier.setPrimaryContactName("John Doe");
        supplier.setPhoneNumber("+1234567890");
        supplier.setEmail("test@supplier.com");

        supplierDTO = new SupplierRequestDTO();
        supplierDTO.setName("Test Supplier");
        supplierDTO.setBusinessRegistrationNumber("BR123456");
        supplierDTO.setPrimaryContactName("John Doe");
        supplierDTO.setPhoneNumber("+1234567890");
        supplierDTO.setEmail("test@supplier.com");
    }

    @Test
    void shouldCreateSupplier() {
        // given
        given(supplierRepository.save(any(Supplier.class))).willReturn(supplier);

        // when
        SupplierResponseDTO savedSupplier = supplierService.createSupplier(supplierDTO);

        // then
        assertThat(savedSupplier).isNotNull();
        assertThat(savedSupplier.getName()).isEqualTo("Test Supplier");
        verify(supplierRepository, times(1)).save(any(Supplier.class));
    }

    @Test
    void shouldGetSupplierById() {
        // given
        given(supplierRepository.findById(1L)).willReturn(Optional.of(supplier));

        // when
        SupplierResponseDTO foundSupplier = supplierService.getSupplierById(1L);

        // then
        assertThat(foundSupplier).isNotNull();
        assertThat(foundSupplier.getName()).isEqualTo(supplier.getName());
    }

    @Test
    void shouldThrowExceptionWhenSupplierNotFound() {
        // given
        given(supplierRepository.findById(1L)).willReturn(Optional.empty());

        // when/then
        assertThrows(ResourceNotFoundException.class, () -> 
            supplierService.getSupplierById(1L)
        );
    }

    @Test
    void shouldGetAllSuppliers() {
        // given
        Page<Supplier> supplierPage = new PageImpl<>(List.of(supplier));
        given(supplierRepository.findAll(any(Pageable.class))).willReturn(supplierPage);

        // when
        Page<SupplierResponseDTO> result = supplierService.getAllSuppliers(PageRequest.of(0, 10), Map.of());

        // then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().getName()).isEqualTo(supplier.getName());
    }

    @Test
    void shouldUpdateSupplier() {
        // given
        given(supplierRepository.findById(1L)).willReturn(Optional.of(supplier));
        given(supplierRepository.save(any(Supplier.class))).willReturn(supplier);

        supplierDTO.setName("Updated Name");

        // when
        SupplierResponseDTO updatedSupplier = supplierService.updateSupplier(1L, supplierDTO);

        // then
        assertThat(updatedSupplier).isNotNull();
        verify(supplierRepository, times(1)).save(any(Supplier.class));
    }

    @Test
    void shouldDeleteSupplier() {
        // given
        given(supplierRepository.findById(1L)).willReturn(Optional.of(supplier));
        doNothing().when(supplierRepository).delete(supplier);

        // when
        supplierService.deleteSupplier(1L);

        // then
        verify(supplierRepository, times(1)).delete(supplier);
    }

    @Test
    void exportToExcel_ShouldGenerateValidExcelFile() throws IOException {
        // Arrange
        List<Supplier> suppliers = createTestSuppliers();
        when(supplierRepository.findAll()).thenReturn(suppliers);

        // Act
        ByteArrayInputStream excelFile = supplierExportService.exportToExcel();

        // Assert
        assertNotNull(excelFile);
        verify(supplierRepository, times(1)).findAll();
    }

    @Test
    void exportToCsv_ShouldGenerateValidCsvFile() throws IOException {
        // Arrange
        List<Supplier> suppliers = createTestSuppliers();
        when(supplierRepository.findAll()).thenReturn(suppliers);

        // Act
        ByteArrayInputStream csvFile = supplierExportService.exportToCsv();

        // Assert
        assertNotNull(csvFile);
        verify(supplierRepository, times(1)).findAll();
    }

    private List<Supplier> createTestSuppliers() {
        Supplier supplier1 = new Supplier();
        supplier1.setName("Test Supplier 1");
        supplier1.setBusinessRegistrationNumber("BR001");
        supplier1.setEmail("supplier1@test.com");
        supplier1.setPhoneNumber("+1234567890");

        Supplier supplier2 = new Supplier();
        supplier2.setName("Test Supplier 2");
        supplier2.setBusinessRegistrationNumber("BR002");
        supplier2.setEmail("supplier2@test.com");
        supplier2.setPhoneNumber("+1234567891");

        return List.of(supplier1, supplier2);
    }
}
