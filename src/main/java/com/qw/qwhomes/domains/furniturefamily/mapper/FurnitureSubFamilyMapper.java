package com.qw.qwhomes.domains.furniturefamily.mapper;

import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureSubFamilyDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FurnitureSubFamilyMapper {

    @Mapping(target = "familyId", source = "family.familyId")
    FurnitureSubFamilyDTO toDto(FurnitureSubFamily entity);

    @Mapping(target = "family", ignore = true)
    FurnitureSubFamily toEntity(FurnitureSubFamilyDTO dto);

    @Mapping(target = "subFamilyId", ignore = true)
    @Mapping(target = "family", ignore = true)
    void updateEntityFromDto(FurnitureSubFamilyDTO dto, @MappingTarget FurnitureSubFamily entity);
}
