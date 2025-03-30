package com.qw.qwhomes.domains.furniturefamily.service.mapper;

import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import com.qw.qwhomes.domains.furniturefamily.service.dto.FurnitureSubFamilyDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FurnitureSubFamilyMapper {

    @Mapping(target = "familyId", source = "family.familyId")
    @Mapping(target = "familyName", source = "family.name")
    FurnitureSubFamilyDTO toDto(FurnitureSubFamily entity);

    @Mapping(target = "family", ignore = true)
    FurnitureSubFamily toEntity(FurnitureSubFamilyDTO dto);

    @Mapping(target = "subFamilyId", ignore = true)
    @Mapping(target = "family", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(FurnitureSubFamilyDTO dto, @MappingTarget FurnitureSubFamily entity);

    List<FurnitureSubFamily> toEntityList(List<FurnitureSubFamilyDTO> furnitureSubFamilyDTOs);

    List<FurnitureSubFamilyDTO> toDtoList(List<FurnitureSubFamily> entity);
}
