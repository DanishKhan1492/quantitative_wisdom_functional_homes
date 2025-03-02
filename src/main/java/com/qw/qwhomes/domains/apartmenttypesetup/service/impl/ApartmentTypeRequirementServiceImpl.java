package com.qw.qwhomes.domains.apartmenttypesetup.service.impl;

import com.qw.qwhomes.common.exceptions.BusinessException;
import com.qw.qwhomes.config.QWContext;
import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import com.qw.qwhomes.domains.apartmenttype.data.repository.ApartmentTypeRepository;
import com.qw.qwhomes.domains.apartmenttypesetup.data.entity.ApartmentTypeRequirement;
import com.qw.qwhomes.domains.apartmenttypesetup.data.repository.ApartmentTypeFamiliesAndSubFamiliesProjection;
import com.qw.qwhomes.domains.apartmenttypesetup.data.repository.ApartmentTypeRequirementRepository;
import com.qw.qwhomes.domains.apartmenttypesetup.service.ApartmentTypeRequirementService;
import com.qw.qwhomes.domains.apartmenttypesetup.service.dto.ApartmentTypeRequirementDTO;
import com.qw.qwhomes.domains.apartmenttypesetup.service.mapper.ApartmentTypeRequirementMapper;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import com.qw.qwhomes.domains.furniturefamily.data.repository.FurnitureFamilyRepository;
import com.qw.qwhomes.domains.furniturefamily.data.repository.FurnitureSubFamilyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApartmentTypeRequirementServiceImpl implements ApartmentTypeRequirementService {

    private final ApartmentTypeRequirementRepository apartmentTypeRequirementRepository;
    private final ApartmentTypeRepository apartmentTypeRepository;
    private final FurnitureFamilyRepository furnitureFamilyRepository;
    private final FurnitureSubFamilyRepository furnitureSubFamilyRepository;
    private final ApartmentTypeRequirementMapper apartmentTypeRequirementMapper;

    @Override
    @Transactional
    public ApartmentTypeRequirementDTO createApartmentTypeRequirement(ApartmentTypeRequirementDTO createApartmentTypeRequirementDto) {
        ApartmentType apartmentType = apartmentTypeRepository.findById(createApartmentTypeRequirementDto.getApartmentTypeId())
                .orElseThrow(() -> new BusinessException("Category not found"));
        FurnitureFamily furnitureFamily = furnitureFamilyRepository.findById(createApartmentTypeRequirementDto.getFamilyId())
                .orElseThrow(() -> new BusinessException("FurnitureFamily not found"));
        FurnitureSubFamily furnitureSubFamily = furnitureSubFamilyRepository.findById(createApartmentTypeRequirementDto.getSubFamilyId())
                .orElseThrow(() -> new BusinessException("FurnitureSubFamily not found"));

        ApartmentTypeRequirement apartmentTypeRequirement = apartmentTypeRequirementMapper.toEntity(createApartmentTypeRequirementDto);
        apartmentTypeRequirement.setApartmentType(apartmentType);
        apartmentTypeRequirement.setFamily(furnitureFamily);
        apartmentTypeRequirement.setSubFamily(furnitureSubFamily);
        apartmentTypeRequirement.setCreatedBy(QWContext.get().getUserId());

        ApartmentTypeRequirement savedApartmentType = apartmentTypeRequirementRepository.save(apartmentTypeRequirement);
        return apartmentTypeRequirementMapper.toDTO(savedApartmentType);
    }

    @Override
    @Transactional(readOnly = true)
    public ApartmentTypeRequirementDTO getApartmentTypeRequirementById(Long id) {
        ApartmentTypeRequirement apartmentTypeRequirement = apartmentTypeRequirementRepository.findById(id)
                .orElseThrow(() -> new BusinessException("ApartmentType not found"));
        return apartmentTypeRequirementMapper.toDTO(apartmentTypeRequirement);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApartmentTypeRequirementDTO> getAllApartmentTypeRequirements(Pageable pageable, String search) {
        Specification<ApartmentTypeRequirement> spec = (root, query, cb) -> {
            if (search != null && !search.isEmpty()) {
                return cb.or(
                    cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%")
                );
            }
            return null;
        };

        Page<ApartmentTypeRequirement> apartmentTypes = apartmentTypeRequirementRepository.findAll(spec, pageable);
        return apartmentTypes.map(apartmentTypeRequirementMapper::toDTO);
    }

    @Override
    @Transactional
    public ApartmentTypeRequirementDTO updateApartmentTypeRequirement(ApartmentTypeRequirementDTO apartmentTypeRequirementDTO) {
        ApartmentTypeRequirement existingApartmentType = apartmentTypeRequirementRepository.findById(apartmentTypeRequirementDTO.getApartmentTypeRequirementId())
                .orElseThrow(() -> new BusinessException("ApartmentType not found"));

        if (!Objects.equals(existingApartmentType.getApartmentType().getApartmentId(), apartmentTypeRequirementDTO.getApartmentTypeId())) {
            ApartmentType apartmentType = apartmentTypeRepository.findById(apartmentTypeRequirementDTO.getApartmentTypeId())
                    .orElseThrow(() -> new BusinessException("ApartmentType not found"));
            existingApartmentType.setApartmentType(apartmentType);
        }

        if (!Objects.equals(existingApartmentType.getFamily().getFamilyId(), apartmentTypeRequirementDTO.getFamilyId())) {
            FurnitureFamily furnitureFamily = furnitureFamilyRepository.findById(apartmentTypeRequirementDTO.getFamilyId())
                    .orElseThrow(() -> new BusinessException("FurnitureFamily not found"));
            existingApartmentType.setFamily(furnitureFamily);
        }

        if (!Objects.equals(existingApartmentType.getSubFamily().getSubFamilyId(), apartmentTypeRequirementDTO.getSubFamilyId())) {
            FurnitureSubFamily furnitureSubFamily = furnitureSubFamilyRepository.findById(apartmentTypeRequirementDTO.getSubFamilyId())
                    .orElseThrow(() -> new BusinessException("FurnitureSubFamily not found"));
            existingApartmentType.setSubFamily(furnitureSubFamily);
        }

        apartmentTypeRequirementMapper.updateEntityFromDTO(apartmentTypeRequirementDTO, existingApartmentType);
        existingApartmentType.setUpdatedBy(QWContext.get().getUserId());
        ApartmentTypeRequirement updatedApartmentType = apartmentTypeRequirementRepository.save(existingApartmentType);
        return apartmentTypeRequirementMapper.toDTO(updatedApartmentType);
    }

    @Override
    @Transactional
    public void deleteApartmentTypeRequirement(Long id) {
        if (!apartmentTypeRequirementRepository.existsById(id)) {
            throw new BusinessException("ApartmentType not found");
        }
        apartmentTypeRequirementRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Map<Long, Object> getApartmentTypeFamiliesAndSubFamilies(Long id) {
        List<ApartmentTypeFamiliesAndSubFamiliesProjection> familiesAndSubFamilies = apartmentTypeRequirementRepository.findFamiliesAndSubFamiliesByApartmentTypeId(id);
        return familiesAndSubFamilies.stream()
                .collect(Collectors.groupingBy(
                        ApartmentTypeFamiliesAndSubFamiliesProjection::getFamilyId,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    Map<String, Object> familyData = new HashMap<>();
                                    familyData.put("familyName", list.get(0).getFamilyName());
                                    Map<Long, String> subFamilies = list.stream()
                                            .collect(Collectors.toMap(
                                                    ApartmentTypeFamiliesAndSubFamiliesProjection::getSubFamilyId,
                                                    ApartmentTypeFamiliesAndSubFamiliesProjection::getSubFamilyName,
                                                    (existing, replacement) -> existing
                                            ));
                                    familyData.put("subFamilies", subFamilies);
                                    return familyData;
                                }
                        )
                ));
    }
}
