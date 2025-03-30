package com.qw.qwhomes.domains.colour.service.mapper;

import com.qw.qwhomes.domains.colour.data.entity.Colour;
import com.qw.qwhomes.domains.colour.service.dto.ColourDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ColourMapper {
    ColourDTO toDto(Colour colour);
    Colour toEntity(ColourDTO dto);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ColourDTO dto, @MappingTarget Colour colour);
}
