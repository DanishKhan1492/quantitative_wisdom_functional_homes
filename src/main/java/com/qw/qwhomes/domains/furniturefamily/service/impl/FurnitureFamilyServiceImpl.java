package com.qw.qwhomes.domains.furniturefamily.service.impl;

import com.qw.qwhomes.common.dto.PageableResponse;
import com.qw.qwhomes.common.exceptions.ResourceDuplicateException;
import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.domains.category.data.entity.Category;
import com.qw.qwhomes.domains.category.data.repository.CategoryRepository;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import com.qw.qwhomes.domains.furniturefamily.data.repository.FurnitureFamilyRepository;
import com.qw.qwhomes.domains.furniturefamily.data.repository.FurnitureSubFamilyRepository;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureFamilyDTO;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureSubFamilyDTO;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureSubFamilyResponseDTO;
import com.qw.qwhomes.domains.furniturefamily.mapper.FurnitureFamilyMapper;
import com.qw.qwhomes.domains.furniturefamily.mapper.FurnitureSubFamilyMapper;
import com.qw.qwhomes.domains.furniturefamily.service.FurnitureFamilyService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
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
    public FurnitureFamilyDTO createFurnitureFamily(FurnitureFamilyDTO furnitureFamilyDto) {
        var category = categoryRepository.findById(furnitureFamilyDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("category.not.found", new Object[]{furnitureFamilyDto.getCategoryId()}, LocaleContextHolder.getLocale())));

        var furnitureFamilyExists = furnitureFamilyRepository.existsFurnitureFamilyByNameIgnoreCase(furnitureFamilyDto.getName());
        if (furnitureFamilyExists) {
            throw new ResourceDuplicateException(messageSource.getMessage("furnitureFamily.duplicate", new Object[]{furnitureFamilyDto.getName()}, LocaleContextHolder.getLocale()));
        }


        FurnitureFamily furnitureFamily = furnitureFamilyMapper.toEntity(furnitureFamilyDto);
        furnitureFamily.setCategory(category);

        if (CollectionUtils.isNotEmpty(furnitureFamilyDto.getSubFamilies())) {
            List<FurnitureSubFamily> subFamilies = furnitureFamilyDto.getSubFamilies().stream()
                    .map(furnitureSubFamilyMapper::toEntity)
                    .peek(subFamily -> subFamily.setFamily(furnitureFamily))
                    .toList();
            furnitureFamily.setSubFamilies(new HashSet<>(subFamilies));
        }

        FurnitureFamily savedFurnitureFamily = furnitureFamilyRepository.save(furnitureFamily);
        return furnitureFamilyMapper.toResponseDTO(savedFurnitureFamily);
    }

    @Override
    @Transactional(readOnly = true)
    public FurnitureFamilyDTO getFurnitureFamilyById(Long id) {
        FurnitureFamily furnitureFamily = furnitureFamilyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.not.found", new Object[]{id}, LocaleContextHolder.getLocale())));
        return furnitureFamilyMapper.toResponseDTO(furnitureFamily);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FurnitureFamilyDTO> getAllFurnitureFamilies(Pageable pageable) {
        return furnitureFamilyRepository.findAll(pageable).stream()
                .map(furnitureFamilyMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FurnitureFamilyDTO> getFurnitureFamiliesByCategory(Long categoryId) {
        return furnitureFamilyRepository.findByCategoryId(categoryId).stream()
                .map(furnitureFamilyMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FurnitureFamilyDTO updateFurnitureFamily(Long id, FurnitureFamilyDTO furnitureFamilyDto) {
        FurnitureFamily furnitureFamily = furnitureFamilyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.not.found", new Object[]{id}, LocaleContextHolder.getLocale())));

        if(!Objects.equals(furnitureFamily.getCategory().getId(), furnitureFamilyDto.getCategoryId())){
            Category category = categoryRepository.findById(furnitureFamilyDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("category.not.found", new Object[]{furnitureFamilyDto.getCategoryId()}, LocaleContextHolder.getLocale())));
            furnitureFamily.setCategory(category);
        }
        furnitureFamilyMapper.updateEntityFromDTO(furnitureFamilyDto, furnitureFamily);

        if (CollectionUtils.isNotEmpty(furnitureFamilyDto.getSubFamilies())) {
            // Update existing subfamilies and add new ones
            for (FurnitureSubFamilyDTO subFamilyDTO : furnitureFamilyDto.getSubFamilies()) {
                FurnitureSubFamily subFamily = furnitureFamily.getSubFamilies().stream()
                        .filter(sf -> sf.getSubFamilyId().equals(subFamilyDTO.getSubFamilyId()))
                        .findFirst()
                        .orElse(null);

                if (subFamily != null) {
                    // Update existing subfamily
                    furnitureSubFamilyMapper.updateEntityFromDto(subFamilyDTO, subFamily);
                } else {
                    // Add new subfamily
                    subFamily = furnitureSubFamilyMapper.toEntity(subFamilyDTO);
                    subFamily.setFamily(furnitureFamily);
                    furnitureFamily.getSubFamilies().add(subFamily);
                }
            }
        }

        if (CollectionUtils.isNotEmpty(furnitureFamilyDto.getRemovedSubFamilies())) {
            // Remove subfamilies listed in removedSubFamilies
            furnitureFamily.getSubFamilies().removeIf(subFamily ->
                    furnitureFamilyDto.getRemovedSubFamilies().stream()
                            .anyMatch(removedSubFamilyId -> removedSubFamilyId.equals(subFamily.getSubFamilyId()))
            );
        }

        FurnitureFamily updatedFurnitureFamily = furnitureFamilyRepository.save(furnitureFamily);
        return furnitureFamilyMapper.toResponseDTO(updatedFurnitureFamily);
    }

    @Override
    @Transactional
    public void deleteFurnitureFamily(Long id) {
        var furnitureFamily = furnitureFamilyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.not.found", new Object[]{id}, LocaleContextHolder.getLocale())));
        furnitureFamilyRepository.delete(furnitureFamily);
    }

    @Override
    @Transactional
    public FurnitureSubFamilyResponseDTO createFurnitureSubFamily(Long familyId, List<FurnitureSubFamilyDTO> furnitureSubFamilyDTO) {
        var family = furnitureFamilyRepository.findById(familyId)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.not.found", new Object[]{familyId}, LocaleContextHolder.getLocale())));

        StringBuilder duplicateSubFamilies = new StringBuilder("Following Sub Families already exists: ");
        for (FurnitureSubFamilyDTO subFamilyDTO : furnitureSubFamilyDTO) {
            var subFamilyExists = furnitureSubFamilyRepository.existsFurnitureSubFamilyByNameIgnoreCase(subFamilyDTO.getName());
            if (subFamilyExists) {
                duplicateSubFamilies.append(subFamilyDTO.getName()).append(", ");
            }
        }
        duplicateSubFamilies.append("Other Sub Families are created/updated/removed successfully.");

        List<FurnitureSubFamily> subFamilies = furnitureSubFamilyMapper.toEntityList(furnitureSubFamilyDTO);
        family.getSubFamilies().addAll(subFamilies);
        FurnitureFamily savedFamily = furnitureFamilyRepository.save(family);
        return new FurnitureSubFamilyResponseDTO(furnitureSubFamilyMapper.toDtoList(new ArrayList<>(savedFamily.getSubFamilies())), duplicateSubFamilies.toString());
    }

    @Override
    @Transactional
    public FurnitureSubFamilyDTO updateFurnitureSubFamily(Long subFamilyId, FurnitureSubFamilyDTO furnitureSubFamilyDTO) {
        FurnitureSubFamily subFamily = furnitureSubFamilyRepository.findById(subFamilyId)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureSubFamily.not.found", new Object[]{subFamilyId}, LocaleContextHolder.getLocale())));
        furnitureSubFamilyMapper.updateEntityFromDto(furnitureSubFamilyDTO, subFamily);
        var savedSubFamily = furnitureSubFamilyRepository.save(subFamily);
        return furnitureSubFamilyMapper.toDto(savedSubFamily);
    }

    @Override
    @Transactional
    public void deleteFurnitureSubFamily(Long subFamilyId) {
        furnitureSubFamilyRepository.deleteById(subFamilyId);
    }

    @Override
    @Transactional(readOnly = true)
    public FurnitureSubFamilyDTO getFurnitureSubFamily(Long subFamilyId) {
        var subFamily = furnitureSubFamilyRepository.findById(subFamilyId)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureSubFamily.not.found", new Object[]{subFamilyId}, LocaleContextHolder.getLocale())));
        return furnitureSubFamilyMapper.toDto(subFamily);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FurnitureSubFamilyDTO> getAllFurnitureSubFamilies(Long familyId) {
        List<FurnitureSubFamily> subFamilies = furnitureSubFamilyRepository.findByFamilyId(familyId);
        return subFamilies.stream()
                .map(furnitureSubFamilyMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PageableResponse<FurnitureSubFamilyDTO> getAllSubFamilies(Pageable pageable) {
        return new PageableResponse<>(furnitureSubFamilyRepository.findAll(pageable)
                .map(furnitureSubFamilyMapper::toDto));
    }
}
