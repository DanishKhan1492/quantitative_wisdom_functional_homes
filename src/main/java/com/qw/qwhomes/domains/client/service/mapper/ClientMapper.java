package com.qw.qwhomes.domains.client.service.mapper;

import com.qw.qwhomes.domains.client.data.entity.Client;
import com.qw.qwhomes.domains.client.service.dto.ClientDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientDTO toDto(Client client);
    Client toEntity(ClientDTO dto);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(ClientDTO dto, @MappingTarget Client client);
}
