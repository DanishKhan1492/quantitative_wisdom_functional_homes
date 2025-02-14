package com.qw.qwhomes.domains.material.service.mapper;

import com.qw.qwhomes.domains.material.data.entity.Material;
import com.qw.qwhomes.domains.material.service.dto.MaterialDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MaterialMapper {

    Material toEntity(MaterialDTO dto);

    MaterialDTO toResponseDTO(Material entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(MaterialDTO dto, @MappingTarget Material entity);
}
