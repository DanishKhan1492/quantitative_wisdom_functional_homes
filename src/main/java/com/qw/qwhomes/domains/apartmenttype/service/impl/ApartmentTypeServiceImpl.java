package com.qw.qwhomes.domains.apartmenttype.service.impl;

import com.qw.qwhomes.common.exceptions.BusinessException;
import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import com.qw.qwhomes.domains.apartmenttype.data.repository.ApartmentTypeRepository;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeCreateDTO;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeResponseDTO;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeUpdateDTO;
import com.qw.qwhomes.domains.apartmenttype.mapper.ApartmentTypeMapper;
import com.qw.qwhomes.domains.apartmenttype.service.ApartmentTypeService;
import com.qw.qwhomes.domains.category.data.entity.Category;
import com.qw.qwhomes.domains.category.data.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApartmentTypeServiceImpl implements ApartmentTypeService {

    private final ApartmentTypeRepository apartmentTypeRepository;
    private final CategoryRepository categoryRepository;
    private final ApartmentTypeMapper apartmentTypeMapper;

    @Override
    @Transactional
    public ApartmentTypeResponseDTO createApartmentType(ApartmentTypeCreateDTO createDTO) {
        Category category = categoryRepository.findById(createDTO.getCategoryId())
                .orElseThrow(() -> new BusinessException("Category not found"));

        ApartmentType apartmentType = apartmentTypeMapper.toEntity(createDTO);
        apartmentType.setCategory(category);

        ApartmentType savedApartmentType = apartmentTypeRepository.save(apartmentType);
        return apartmentTypeMapper.toResponseDTO(savedApartmentType);
    }

    @Override
    @Transactional(readOnly = true)
    public ApartmentTypeResponseDTO getApartmentTypeById(Long id) {
        ApartmentType apartmentType = apartmentTypeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("ApartmentType not found"));
        return apartmentTypeMapper.toResponseDTO(apartmentType);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApartmentTypeResponseDTO> getAllApartmentTypes(Pageable pageable, String search) {
        Specification<ApartmentType> spec = (root, query, cb) -> {
            if (search != null && !search.isEmpty()) {
                return cb.or(
                    cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("description")), "%" + search.toLowerCase() + "%")
                );
            }
            return null;
        };

        Page<ApartmentType> apartmentTypes = apartmentTypeRepository.findAll(spec, pageable);
        return apartmentTypes.map(apartmentTypeMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public ApartmentTypeResponseDTO updateApartmentType(ApartmentTypeUpdateDTO updateDTO) {
        ApartmentType existingApartmentType = apartmentTypeRepository.findById(updateDTO.getId())
                .orElseThrow(() -> new BusinessException("ApartmentType not found"));

        if (updateDTO.getCategoryId() != null && !updateDTO.getCategoryId().equals(existingApartmentType.getCategory().getId())) {
            Category newCategory = categoryRepository.findById(updateDTO.getCategoryId())
                    .orElseThrow(() -> new BusinessException("Category not found"));
            existingApartmentType.setCategory(newCategory);
        }

        apartmentTypeMapper.updateEntityFromDTO(updateDTO, existingApartmentType);
        ApartmentType updatedApartmentType = apartmentTypeRepository.save(existingApartmentType);
        return apartmentTypeMapper.toResponseDTO(updatedApartmentType);
    }

    @Override
    @Transactional
    public void deleteApartmentType(Long id) {
        if (!apartmentTypeRepository.existsById(id)) {
            throw new BusinessException("ApartmentType not found");
        }
        apartmentTypeRepository.deleteById(id);
    }
}
