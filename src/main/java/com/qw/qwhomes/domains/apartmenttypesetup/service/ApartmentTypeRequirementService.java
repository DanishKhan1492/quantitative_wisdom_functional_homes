package com.qw.qwhomes.domains.apartmenttypesetup.service;

import com.qw.qwhomes.domains.apartmenttypesetup.service.dto.ApartmentTypeRequirementDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface ApartmentTypeRequirementService {
    ApartmentTypeRequirementDTO createApartmentTypeRequirement(ApartmentTypeRequirementDTO createDTO);
    ApartmentTypeRequirementDTO getApartmentTypeRequirementById(Long id);
    Page<ApartmentTypeRequirementDTO> getAllApartmentTypeRequirements(Pageable pageable, String search);
    ApartmentTypeRequirementDTO updateApartmentTypeRequirement(ApartmentTypeRequirementDTO updateDTO);
    void deleteApartmentTypeRequirement(Long id);

    Map<Long, Object> getApartmentTypeFamiliesAndSubFamilies(Long id);
}
