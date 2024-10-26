package com.qw.qwhomes.domains.apartmenttype.mapper;

import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeCreateDTO;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeResponseDTO;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeUpdateDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {ApartmentTypeRequirementMapper.class})
public interface ApartmentTypeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category.id", source = "categoryId")
    ApartmentType toEntity(ApartmentTypeCreateDTO dto);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    ApartmentTypeResponseDTO toResponseDTO(ApartmentType entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "category.id", source = "categoryId")
    void updateEntityFromDTO(ApartmentTypeUpdateDTO dto, @MappingTarget ApartmentType entity);
}
