package com.qw.qwhomes.domains.apartmenttype.mapper;

import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentTypeRequirement;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeRequirementDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ApartmentTypeRequirementMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "apartmentType", ignore = true)
    @Mapping(target = "family.familyId", source = "familyId")
    @Mapping(target = "subFamily.subFamilyId", source = "subFamilyId")
    ApartmentTypeRequirement toEntity(ApartmentTypeRequirementDTO dto);

    @Mapping(target = "familyId", source = "family.familyId")
    @Mapping(target = "subFamilyId", source = "subFamily.subFamilyId")
    ApartmentTypeRequirementDTO toDTO(ApartmentTypeRequirement entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(ApartmentTypeRequirementDTO dto, @MappingTarget ApartmentTypeRequirement entity);
}
