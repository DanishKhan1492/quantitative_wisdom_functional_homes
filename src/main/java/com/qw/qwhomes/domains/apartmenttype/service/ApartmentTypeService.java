package com.qw.qwhomes.domains.apartmenttype.service;

import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeCreateDTO;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeResponseDTO;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApartmentTypeService {
    ApartmentTypeResponseDTO createApartmentType(ApartmentTypeCreateDTO createDTO);
    ApartmentTypeResponseDTO getApartmentTypeById(Long id);
    Page<ApartmentTypeResponseDTO> getAllApartmentTypes(Pageable pageable, String search);
    ApartmentTypeResponseDTO updateApartmentType(ApartmentTypeUpdateDTO updateDTO);
    void deleteApartmentType(Long id);
}
