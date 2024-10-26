package com.qw.qwhomes.domains.colour.service.mapper;

import com.qw.qwhomes.domains.colour.data.entity.Colour;
import com.qw.qwhomes.domains.colour.service.dto.ColourRequestDTO;
import com.qw.qwhomes.domains.colour.service.dto.ColourResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ColourMapper {
    ColourResponseDTO toDto(Colour colour);
    Colour toEntity(ColourRequestDTO dto);
    void updateEntityFromDto(ColourRequestDTO dto, @MappingTarget Colour colour);
}
