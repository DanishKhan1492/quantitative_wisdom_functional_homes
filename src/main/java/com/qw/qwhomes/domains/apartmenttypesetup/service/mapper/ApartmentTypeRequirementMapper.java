package com.qw.qwhomes.domains.apartmenttypesetup.service.mapper;

import com.qw.qwhomes.domains.apartmenttypesetup.data.entity.ApartmentTypeRequirement;
import com.qw.qwhomes.domains.apartmenttypesetup.service.dto.ApartmentTypeRequirementDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ApartmentTypeRequirementMapper {

    @Mapping(target = "apartmentTypeRequirementId", ignore = true)
    @Mapping(target = "apartmentType", ignore = true)
    @Mapping(target = "family.familyId", source = "familyId")
    @Mapping(target = "subFamily.subFamilyId", source = "subFamilyId")
    ApartmentTypeRequirement toEntity(ApartmentTypeRequirementDTO dto);

    @Mapping(target = "familyId", source = "family.familyId")
    @Mapping(target = "subFamilyId", source = "subFamily.subFamilyId")
    @Mapping(target = "apartmentTypeId", source = "apartmentType.apartmentId")
    @Mapping(target = "familyName", source = "family.name")
    @Mapping(target = "subFamilyName", source = "subFamily.name")
    @Mapping(target = "apartmentTypeName", source = "apartmentType.name")
    ApartmentTypeRequirementDTO toDTO(ApartmentTypeRequirement entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(ApartmentTypeRequirementDTO dto, @MappingTarget ApartmentTypeRequirement entity);
}
