package com.qw.qwhomes.domains.furniturefamily.service.impl;

import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.domains.category.data.entity.Category;
import com.qw.qwhomes.domains.category.data.repository.CategoryRepository;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import com.qw.qwhomes.domains.furniturefamily.data.repository.FurnitureFamilyRepository;
import com.qw.qwhomes.domains.furniturefamily.data.repository.FurnitureSubFamilyRepository;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureFamilyCreateDTO;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureFamilyResponseDTO;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureSubFamilyDTO;
import com.qw.qwhomes.domains.furniturefamily.mapper.FurnitureFamilyMapper;
import com.qw.qwhomes.domains.furniturefamily.mapper.FurnitureSubFamilyMapper;
import com.qw.qwhomes.domains.furniturefamily.service.FurnitureFamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FurnitureFamilyServiceImpl implements FurnitureFamilyService {

    private final FurnitureFamilyRepository furnitureFamilyRepository;
    private final FurnitureSubFamilyRepository furnitureSubFamilyRepository;
    private final CategoryRepository categoryRepository;
    private final FurnitureFamilyMapper furnitureFamilyMapper;
    private final FurnitureSubFamilyMapper furnitureSubFamilyMapper;
    private final MessageSource messageSource;

    @Override
    @Transactional
    public FurnitureFamilyResponseDTO createFurnitureFamily(FurnitureFamilyCreateDTO createDTO) {
        Category category = categoryRepository.findById(createDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("category.not.found", new Object[]{createDTO.getCategoryId()}, LocaleContextHolder.getLocale())));

        FurnitureFamily furnitureFamily = furnitureFamilyMapper.toEntity(createDTO);
        furnitureFamily.setCategory(category);

        if (createDTO.getSubFamilies() != null && !createDTO.getSubFamilies().isEmpty()) {
            List<FurnitureSubFamily> subFamilies = createDTO.getSubFamilies().stream()
                    .map(furnitureSubFamilyMapper::toEntity)
                    .peek(subFamily -> subFamily.setFamily(furnitureFamily))
                    .collect(Collectors.toList());
            furnitureFamily.setSubFamilies(new HashSet<>(subFamilies));
        }

        FurnitureFamily savedFurnitureFamily = furnitureFamilyRepository.save(furnitureFamily);
        return furnitureFamilyMapper.toResponseDTO(savedFurnitureFamily);
    }

    @Override
    @Transactional(readOnly = true)
    public FurnitureFamilyResponseDTO getFurnitureFamilyById(Long id) {
        FurnitureFamily furnitureFamily = furnitureFamilyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.notFound", new Object[]{id}, LocaleContextHolder.getLocale())));
        return furnitureFamilyMapper.toResponseDTO(furnitureFamily);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FurnitureFamilyResponseDTO> getAllFurnitureFamilies() {
        return furnitureFamilyRepository.findAll().stream()
                .map(furnitureFamilyMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FurnitureFamilyResponseDTO> getFurnitureFamiliesByCategory(Long categoryId) {
        return furnitureFamilyRepository.findByCategoryId(categoryId).stream()
                .map(furnitureFamilyMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FurnitureFamilyResponseDTO updateFurnitureFamily(Long id, FurnitureFamilyCreateDTO updateDTO) {
        FurnitureFamily furnitureFamily = furnitureFamilyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.notFound", new Object[]{id}, LocaleContextHolder.getLocale())));

        Category category = categoryRepository.findById(updateDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("category.not.found", new Object[]{updateDTO.getCategoryId()}, LocaleContextHolder.getLocale())));

        furnitureFamilyMapper.updateEntityFromDTO(updateDTO, furnitureFamily);
        furnitureFamily.setCategory(category);

        FurnitureFamily updatedFurnitureFamily = furnitureFamilyRepository.save(furnitureFamily);
        return furnitureFamilyMapper.toResponseDTO(updatedFurnitureFamily);
    }

    @Override
    @Transactional
    public void deleteFurnitureFamily(Long id) {
        FurnitureFamily furnitureFamily = furnitureFamilyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.notFound", new Object[]{id}, LocaleContextHolder.getLocale())));
        furnitureFamilyRepository.delete(furnitureFamily);
    }

    @Override
    @Transactional
    public FurnitureSubFamilyDTO createFurnitureSubFamily(Long familyId, FurnitureSubFamilyDTO furnitureSubFamilyDTO) {
        FurnitureFamily family = furnitureFamilyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.notFound", new Object[]{familyId}, LocaleContextHolder.getLocale())));
        FurnitureSubFamily subFamily = furnitureSubFamilyMapper.toEntity(furnitureSubFamilyDTO);
        subFamily.setFamily(family);
        family.getSubFamilies().add(subFamily);
        FurnitureFamily savedFamily = furnitureFamilyRepository.save(family);
        return furnitureSubFamilyMapper.toDto(subFamily);
    }

    @Override
    @Transactional
    public FurnitureSubFamilyDTO updateFurnitureSubFamily(Long familyId, Long subFamilyId, FurnitureSubFamilyDTO furnitureSubFamilyDTO) {
        FurnitureFamily family = furnitureFamilyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.notFound", new Object[]{familyId}, LocaleContextHolder.getLocale())));
        FurnitureSubFamily subFamily = family.getSubFamilies().stream()
                .filter(sf -> sf.getSubFamilyId().equals(subFamilyId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureSubFamily.notFound", new Object[]{subFamilyId}, LocaleContextHolder.getLocale())));
        furnitureSubFamilyMapper.updateEntityFromDto(furnitureSubFamilyDTO, subFamily);
        FurnitureFamily savedFamily = furnitureFamilyRepository.save(family);
        return furnitureSubFamilyMapper.toDto(subFamily);
    }

    @Override
    @Transactional
    public void deleteFurnitureSubFamily(Long familyId, Long subFamilyId) {
        FurnitureFamily family = furnitureFamilyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.notFound", new Object[]{familyId}, LocaleContextHolder.getLocale())));
        family.getSubFamilies().removeIf(sf -> sf.getSubFamilyId().equals(subFamilyId));
        furnitureFamilyRepository.save(family);
    }

    @Override
    @Transactional(readOnly = true)
    public FurnitureSubFamilyDTO getFurnitureSubFamily(Long familyId, Long subFamilyId) {
        FurnitureFamily family = furnitureFamilyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.notFound", new Object[]{familyId}, LocaleContextHolder.getLocale())));
        FurnitureSubFamily subFamily = family.getSubFamilies().stream()
                .filter(sf -> sf.getSubFamilyId().equals(subFamilyId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureSubFamily.notFound", new Object[]{subFamilyId}, LocaleContextHolder.getLocale())));
        return furnitureSubFamilyMapper.toDto(subFamily);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FurnitureSubFamilyDTO> getAllFurnitureSubFamilies(Long familyId) {
        List<FurnitureSubFamily> subFamilies = furnitureFamilyRepository.findSubFamiliesByFamilyId(familyId);
        return subFamilies.stream()
                .map(furnitureSubFamilyMapper::toDto)
                .collect(Collectors.toList());
    }
}
