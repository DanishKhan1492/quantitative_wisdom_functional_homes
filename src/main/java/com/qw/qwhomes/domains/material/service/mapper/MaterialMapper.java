package com.qw.qwhomes.domains.material.service.mapper;

import com.qw.qwhomes.domains.material.data.entity.Material;
import com.qw.qwhomes.domains.material.dto.MaterialCreateDTO;
import com.qw.qwhomes.domains.material.dto.MaterialResponseDTO;
import com.qw.qwhomes.domains.material.dto.MaterialUpdateDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MaterialMapper {

    Material toEntity(MaterialCreateDTO dto);

    MaterialResponseDTO toResponseDTO(Material entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(MaterialUpdateDTO dto, @MappingTarget Material entity);
}
