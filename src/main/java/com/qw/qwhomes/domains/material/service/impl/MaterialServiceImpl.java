package com.qw.qwhomes.domains.material.service.impl;

import com.qw.qwhomes.common.exceptions.ResourceDuplicateException;
import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.config.QWContext;
import com.qw.qwhomes.domains.material.data.entity.Material;
import com.qw.qwhomes.domains.material.data.repository.MaterialRepository;
import com.qw.qwhomes.domains.material.service.dto.MaterialDTO;
import com.qw.qwhomes.domains.material.service.MaterialService;
import com.qw.qwhomes.domains.material.service.dto.MaterialDashboardDTO;
import com.qw.qwhomes.domains.material.service.mapper.MaterialMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;
    private final MessageSource messageSource;

    @Override
    @Transactional
    public MaterialDTO createMaterial(MaterialDTO materialDto) {
        var materialAlreadyExists = materialRepository.existsByNameIgnoreCase(materialDto.getName());
        if (materialAlreadyExists) {
            throw new ResourceDuplicateException(messageSource.getMessage("material.duplicate", new Object[]{materialDto.getName()}, Locale.getDefault()));
        }
        Material material = materialMapper.toEntity(materialDto);
        material.setCreatedBy(QWContext.get().getUserId());
        Material savedMaterial = materialRepository.save(material);
        return materialMapper.toResponseDTO(savedMaterial);
    }

    @Override
    @Transactional(readOnly = true)
    public MaterialDTO getMaterialById(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("material.not.found", new Object[]{id}, Locale.getDefault())));
        return materialMapper.toResponseDTO(material);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MaterialDTO> getAllMaterials(Pageable pageable) {
        return materialRepository.findAll(pageable)
                .map(materialMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public MaterialDTO updateMaterial(Long id, MaterialDTO updateDTO) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("material.not.found", new Object[]{id}, Locale.getDefault())));
        materialMapper.updateEntityFromDTO(updateDTO, material);
        material.setUpdatedBy(QWContext.get().getUserId());
        Material updatedMaterial = materialRepository.save(material);
        return materialMapper.toResponseDTO(updatedMaterial);
    }

    @Override
    @Transactional
    public void deleteMaterial(Long id) {
        if (!materialRepository.existsById(id)) {
            throw new ResourceNotFoundException(messageSource.getMessage("material.not.found", new Object[]{id}, Locale.getDefault()));
        }
        materialRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public MaterialDashboardDTO getMaterialsMetaData() {
        return materialRepository.getMaterialsMetaData();
    }
}
