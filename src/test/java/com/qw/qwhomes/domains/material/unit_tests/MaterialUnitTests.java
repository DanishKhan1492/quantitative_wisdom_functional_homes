package com.qw.qwhomes.domains.material.unit_tests;

import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.domains.material.data.entity.Material;
import com.qw.qwhomes.domains.material.data.repository.MaterialRepository;
import com.qw.qwhomes.domains.material.service.dto.MaterialDTO;
import com.qw.qwhomes.domains.material.service.impl.MaterialServiceImpl;
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

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MaterialUnitTests {

    @Mock
    private MaterialRepository materialRepository;

    @InjectMocks
    private MaterialServiceImpl materialService;

    private Material testMaterial;
    private MaterialDTO testMaterialDTO;

    @BeforeEach
    void setUp() {
        testMaterial = new Material();
        testMaterial.setMaterialId(1L);
        testMaterial.setName("Test Material");
        testMaterial.setType("Wood");
        testMaterial.setDescription("Test Description");

        testMaterialDTO = new MaterialDTO();
        testMaterialDTO.setName("Test Material");
        testMaterialDTO.setType("Wood");
        testMaterialDTO.setDescription("Test Description");
    }

    @Test
    void shouldCreateMaterial() {
        when(materialRepository.save(any(Material.class))).thenReturn(testMaterial);

        MaterialDTO result = materialService.createMaterial(testMaterialDTO);

        assertNotNull(result);
        assertEquals(testMaterialDTO.getName(), result.getName());
        assertEquals(testMaterialDTO.getType(), result.getType());
        verify(materialRepository).save(any(Material.class));
    }

    @Test
    void shouldGetAllMaterials() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Material> materialPage = new PageImpl<>(Collections.singletonList(testMaterial));
        
        when(materialRepository.findAll(pageable)).thenReturn(materialPage);

        Page<MaterialDTO> result = materialService.getAllMaterials(pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testMaterial.getName(), result.getContent().getFirst().getName());
    }

    @Test
    void shouldGetMaterialById() {
        when(materialRepository.findById(1L)).thenReturn(Optional.of(testMaterial));

        MaterialDTO result = materialService.getMaterialById(1L);

        assertNotNull(result);
        assertEquals(testMaterial.getName(), result.getName());
    }

    @Test
    void shouldThrowExceptionWhenMaterialNotFound() {
        when(materialRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> materialService.getMaterialById(99L));
    }

    @Test
    void shouldUpdateMaterial() {
        when(materialRepository.findById(1L)).thenReturn(Optional.of(testMaterial));
        when(materialRepository.save(any(Material.class))).thenReturn(testMaterial);

        MaterialDTO updateDTO = new MaterialDTO();
        updateDTO.setName("Updated Material");
        updateDTO.setType("Updated Type");

        MaterialDTO result = materialService.updateMaterial(1L, updateDTO);

        assertNotNull(result);
        assertEquals(updateDTO.getName(), result.getName());
        assertEquals(updateDTO.getType(), result.getType());
    }

    @Test
    void shouldDeleteMaterial() {
        when(materialRepository.findById(1L)).thenReturn(Optional.of(testMaterial));
        doNothing().when(materialRepository).delete(testMaterial);

        materialService.deleteMaterial(1L);

        verify(materialRepository).delete(testMaterial);
    }

    @Test
    void shouldValidateMaterialFields() {
        MaterialDTO invalidDTO = new MaterialDTO();
        // Name is required
        invalidDTO.setType("Wood");

        assertThrows(IllegalArgumentException.class, () -> materialService.createMaterial(invalidDTO));
    }

    @Test
    void shouldHandleEmptyMaterialList() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Material> emptyPage = new PageImpl<>(List.of());
        
        when(materialRepository.findAll(pageable)).thenReturn(emptyPage);

        Page<MaterialDTO> result = materialService.getAllMaterials(pageable);

        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
    }
}
