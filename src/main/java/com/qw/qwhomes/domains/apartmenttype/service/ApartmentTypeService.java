package com.qw.qwhomes.domains.apartmenttype.service;

import com.qw.qwhomes.domains.apartmenttype.service.dto.ApartmentTypeDTO;
import com.qw.qwhomes.domains.apartmenttype.service.dto.ApartmentTypeDashboardDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApartmentTypeService {
    ApartmentTypeDTO createApartmentType(ApartmentTypeDTO createDTO);
    ApartmentTypeDTO getApartmentTypeById(Long id);
    Page<ApartmentTypeDTO> getAllApartmentTypes(Pageable pageable, String search);
    ApartmentTypeDTO updateApartmentType(ApartmentTypeDTO updateDTO);
    void deleteApartmentType(Long id);
    ApartmentTypeDashboardDTO getApartmentTypeMetadata();
}
