package com.qw.qwhomes.domains.supplier.service.mapper;

import com.qw.qwhomes.domains.supplier.data.entity.Supplier;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierRequestDTO;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SupplierMapper {

    Supplier toEntity(SupplierRequestDTO dto);

    SupplierResponseDTO toDto(Supplier entity);

    void updateSupplierFromDto(SupplierRequestDTO dto, @MappingTarget Supplier entity);
}