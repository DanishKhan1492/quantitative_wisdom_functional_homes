package com.qw.qwhomes.domains.user.service.mapper;

import com.qw.qwhomes.domains.user.data.entity.User;
import com.qw.qwhomes.domains.user.data.entity.Role;
import com.qw.qwhomes.domains.user.dto.*;
import org.mapstruct.*;

import java.util.Set;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    @Mapping(target = "roles", ignore = true)
    User toEntity(UserCreateDTO userCreateDTO);

    UserResponseDTO toDto(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUserFromDto(UserUpdateDTO userUpdateDTO, @MappingTarget User user);

    RoleDto toRoleDto(Role role);

    Role toRole(RoleDto roleDto);

    Set<RoleDto> toRoleDtos(Set<Role> roles);

    Set<Role> toRoles(Set<RoleDto> roleDtos);
}
