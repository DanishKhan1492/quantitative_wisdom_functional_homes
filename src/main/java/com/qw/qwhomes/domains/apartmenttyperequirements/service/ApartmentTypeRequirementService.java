package com.qw.qwhomes.domains.apartmenttyperequirements.service;

import com.qw.qwhomes.domains.apartmenttype.service.dto.ApartmentTypeDTO;
import com.qw.qwhomes.domains.apartmenttyperequirements.service.dto.ApartmentTypeRequirementDTO;
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
