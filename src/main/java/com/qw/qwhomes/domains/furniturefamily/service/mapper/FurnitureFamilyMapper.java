package com.qw.qwhomes.domains.furniturefamily.service.mapper;

import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.service.dto.FurnitureFamilyDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", uses = {FurnitureSubFamilyMapper.class})
public interface FurnitureFamilyMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    FurnitureFamilyDTO toResponseDTO(FurnitureFamily entity);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "subFamilies", ignore = true)
    FurnitureFamily toEntity(FurnitureFamilyDTO dto);

    @Mapping(target = "familyId", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "subFamilies", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(FurnitureFamilyDTO dto, @MappingTarget FurnitureFamily entity);
}
