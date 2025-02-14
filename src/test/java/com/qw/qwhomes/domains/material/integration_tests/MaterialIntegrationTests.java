package com.qw.qwhomes.domains.material.integration_tests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qw.qwhomes.domains.material.data.entity.Material;
import com.qw.qwhomes.domains.material.data.repository.MaterialRepository;
import com.qw.qwhomes.domains.material.service.dto.MaterialDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class MaterialIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MaterialRepository materialRepository;

    private Material testMaterial;

    @BeforeEach
    void setUp() {
        materialRepository.deleteAll();
        
        testMaterial = new Material();
        testMaterial.setName("Test Material");
        testMaterial.setType("Wood");
        testMaterial.setDescription("Test Description");
        testMaterial = materialRepository.save(testMaterial);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateMaterial() throws Exception {
        MaterialDTO materialDTO = new MaterialDTO();
        materialDTO.setName("New Material");
        materialDTO.setType("Metal");
        materialDTO.setDescription("New Description");

        mockMvc.perform(post("/api/v1/materials")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(materialDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Material"))
                .andExpect(jsonPath("$.type").value("Metal"));
    }

    @Test
    @WithMockUser
    void shouldGetAllMaterials() throws Exception {
        mockMvc.perform(get("/api/v1/materials"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.content[0].name").value("Test Material"));
    }

    @Test
    @WithMockUser
    void shouldGetMaterialById() throws Exception {
        mockMvc.perform(get("/api/v1/materials/{id}", testMaterial.getMaterialId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Material"))
                .andExpect(jsonPath("$.type").value("Wood"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldUpdateMaterial() throws Exception {
        MaterialDTO updateDTO = new MaterialDTO();
        updateDTO.setName("Updated Material");
        updateDTO.setType("Updated Type");
        updateDTO.setDescription("Updated Description");

        mockMvc.perform(put("/api/v1/materials/{id}", testMaterial.getMaterialId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Material"))
                .andExpect(jsonPath("$.type").value("Updated Type"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldDeleteMaterial() throws Exception {
        mockMvc.perform(delete("/api/v1/materials/{id}", testMaterial.getMaterialId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/materials/{id}", testMaterial.getMaterialId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void shouldReturn404WhenMaterialNotFound() throws Exception {
        mockMvc.perform(get("/api/v1/materials/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/materials"))
                .andExpect(status().isUnauthorized());
    }
}
