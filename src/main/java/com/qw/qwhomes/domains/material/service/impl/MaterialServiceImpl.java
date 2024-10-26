package com.qw.qwhomes.domains.material.service.impl;

import com.qw.qwhomes.config.QWContext;
import com.qw.qwhomes.domains.material.data.entity.Material;
import com.qw.qwhomes.domains.material.data.repository.MaterialRepository;
import com.qw.qwhomes.domains.material.dto.MaterialCreateDTO;
import com.qw.qwhomes.domains.material.dto.MaterialResponseDTO;
import com.qw.qwhomes.domains.material.dto.MaterialUpdateDTO;
import com.qw.qwhomes.domains.material.service.MaterialService;
import com.qw.qwhomes.domains.material.service.mapper.MaterialMapper;
import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;

    @Override
    @Transactional
    public MaterialResponseDTO createMaterial(MaterialCreateDTO createDTO) {
        Material material = materialMapper.toEntity(createDTO);
        material.setCreatedBy(QWContext.get().getUserId());
        Material savedMaterial = materialRepository.save(material);
        return materialMapper.toResponseDTO(savedMaterial);
    }

    @Override
    @Transactional(readOnly = true)
    public MaterialResponseDTO getMaterialById(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + id));
        return materialMapper.toResponseDTO(material);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MaterialResponseDTO> getAllMaterials(Pageable pageable) {
        return materialRepository.findAll(pageable)
                .map(materialMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public MaterialResponseDTO updateMaterial(Long id, MaterialUpdateDTO updateDTO) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found with id: " + id));
        materialMapper.updateEntityFromDTO(updateDTO, material);
        material.setUpdatedBy(QWContext.get().getUserId());
        Material updatedMaterial = materialRepository.save(material);
        return materialMapper.toResponseDTO(updatedMaterial);
    }

    @Override
    @Transactional
    public void deleteMaterial(Long id) {
        if (!materialRepository.existsById(id)) {
            throw new ResourceNotFoundException("Material not found with id: " + id);
        }
        materialRepository.deleteById(id);
    }
}
