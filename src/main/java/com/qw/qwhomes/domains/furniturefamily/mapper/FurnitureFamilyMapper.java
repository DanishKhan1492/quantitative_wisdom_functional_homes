package com.qw.qwhomes.domains.furniturefamily.mapper;

import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureFamilyCreateDTO;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureFamilyResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {FurnitureSubFamilyMapper.class})
public interface FurnitureFamilyMapper {

    @Mapping(target = "categoryId", source = "category.id")
    FurnitureFamilyResponseDTO toResponseDTO(FurnitureFamily entity);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "subFamilies", ignore = true)
    FurnitureFamily toEntity(FurnitureFamilyCreateDTO dto);

    @Mapping(target = "familyId", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "subFamilies", ignore = true)
    void updateEntityFromDTO(FurnitureFamilyCreateDTO dto, @MappingTarget FurnitureFamily entity);
}
