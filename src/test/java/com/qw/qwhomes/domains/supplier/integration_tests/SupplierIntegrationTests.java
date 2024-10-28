package com.qw.qwhomes.domains.supplier.integration_tests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qw.qwhomes.domains.supplier.data.entity.Supplier;
import com.qw.qwhomes.domains.supplier.data.repository.SupplierRepository;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierRequestDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(Lifecycle.PER_CLASS)
public class SupplierIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SupplierRepository supplierRepository;

    private SupplierRequestDTO testSupplierDTO;

    @BeforeEach
    void setUp() {
        supplierRepository.deleteAll();

        testSupplierDTO = new SupplierRequestDTO();
        testSupplierDTO.setName("Test Supplier");
        testSupplierDTO.setBusinessRegistrationNumber("BR123456");
        testSupplierDTO.setPrimaryContactName("John Doe");
        testSupplierDTO.setPhoneNumber("+1234567890");
        testSupplierDTO.setEmail("test@supplier.com");
    }

    @Test
    void shouldCreateSupplier() throws Exception {
        // when
        ResultActions response = mockMvc.perform(post("/api/v1/suppliers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSupplierDTO)));

        // then
        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is(testSupplierDTO.getName())))
                .andExpect(jsonPath("$.businessRegistrationNumber", 
                        is(testSupplierDTO.getBusinessRegistrationNumber())));
    }

    @Test
    void shouldGetSupplierById() throws Exception {
        // given
        Supplier savedSupplier = supplierRepository.save(convertToEntity(testSupplierDTO));

        // when
        ResultActions response = mockMvc.perform(get("/api/v1/suppliers/{id}", 
                savedSupplier.getId()));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(testSupplierDTO.getName())));
    }

    @Test
    void shouldGetAllSuppliers() throws Exception {
        // given
        supplierRepository.save(convertToEntity(testSupplierDTO));
        
        // when
        ResultActions response = mockMvc.perform(get("/api/v1/suppliers")
                .param("page", "0")
                .param("size", "10"));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.content[0].name", is(testSupplierDTO.getName())));
    }

    @Test
    void shouldUpdateSupplier() throws Exception {
        // given
        Supplier savedSupplier = supplierRepository.save(convertToEntity(testSupplierDTO));
        testSupplierDTO.setName("Updated Name");

        // when
        ResultActions response = mockMvc.perform(put("/api/v1/suppliers/{id}", 
                savedSupplier.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSupplierDTO)));

        // then
        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Updated Name")));
    }

    @Test
    void shouldDeleteSupplier() throws Exception {
        // given
        Supplier savedSupplier = supplierRepository.save(convertToEntity(testSupplierDTO));

        // when
        ResultActions response = mockMvc.perform(delete("/api/v1/suppliers/{id}", 
                savedSupplier.getId()));

        // then
        response.andExpect(status().isNoContent());
        mockMvc.perform(get("/api/v1/suppliers/{id}", savedSupplier.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void exportToExcel_ShouldReturnExcelFile() throws Exception {
        // Arrange
        saveTestSuppliers();

        // Act & Assert
        mockMvc.perform(get("/api/v1/suppliers/export")
                .param("format", "excel")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .andExpect(header().string("Content-Disposition", "attachment; filename=suppliers.xlsx"));
    }

    @Test
    void exportToCsv_ShouldReturnCsvFile() throws Exception {
        // Arrange
        saveTestSuppliers();

        // Act & Assert
        mockMvc.perform(get("/api/v1/suppliers/export")
                .param("format", "csv")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "text/csv"))
                .andExpect(header().string("Content-Disposition", "attachment; filename=suppliers.csv"));
    }

    private void saveTestSuppliers() {
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
        List<Supplier> suppliers = List.of(supplier1, supplier2);
        supplierRepository.saveAll(suppliers);
    }

    private Supplier convertToEntity(SupplierRequestDTO dto) {
        Supplier supplier = new Supplier();
        supplier.setName(dto.getName());
        supplier.setBusinessRegistrationNumber(dto.getBusinessRegistrationNumber());
        supplier.setPrimaryContactName(dto.getPrimaryContactName());
        supplier.setPhoneNumber(dto.getPhoneNumber());
        supplier.setEmail(dto.getEmail());
        return supplier;
    }
}
