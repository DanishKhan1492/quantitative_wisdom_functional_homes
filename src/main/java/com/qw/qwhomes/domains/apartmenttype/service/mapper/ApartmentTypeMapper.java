package com.qw.qwhomes.domains.apartmenttype.service.mapper;

import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import com.qw.qwhomes.domains.apartmenttype.service.dto.ApartmentTypeDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ApartmentTypeMapper {

    @Mapping(target = "apartmentId", ignore = true)
    @Mapping(target = "category.id", source = "categoryId")
    ApartmentType toEntity(ApartmentTypeDTO dto);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    ApartmentTypeDTO toResponseDTO(ApartmentType entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "category.id", source = "categoryId")
    void updateEntityFromDTO(ApartmentTypeDTO dto, @MappingTarget ApartmentType entity);
}
