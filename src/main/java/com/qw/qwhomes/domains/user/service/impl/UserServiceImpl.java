package com.qw.qwhomes.domains.user.service.impl;

import com.qw.qwhomes.domains.user.data.entity.User;
import com.qw.qwhomes.domains.user.data.entity.Role;
import com.qw.qwhomes.domains.user.data.repository.UserRepository;
import com.qw.qwhomes.domains.user.data.repository.RoleRepository;
import com.qw.qwhomes.domains.user.dto.UserCreateDTO;
import com.qw.qwhomes.domains.user.dto.UserResponseDTO;
import com.qw.qwhomes.domains.user.dto.UserUpdateDTO;
import com.qw.qwhomes.domains.user.service.UserService;
import com.qw.qwhomes.domains.user.service.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponseDTO createUser(UserCreateDTO userCreateDTO) {
        User user = userMapper.toEntity(userCreateDTO);
        user.setPasswordHash(passwordEncoder.encode(userCreateDTO.getPassword()));
        user.setStatus("ACTIVE");
        if (userCreateDTO.getRoles() != null) {
            Set<Role> roles = userCreateDTO.getRoles().stream()
                .map(roleDto -> roleRepository.findById(roleDto.getId())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleDto.getId())))
                .collect(Collectors.toSet());
            user.setRoles(roles);
        }
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponseDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDto);
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userMapper.updateUserFromDto(userUpdateDTO, user);
        if (userUpdateDTO.getRoles() != null) {
            Set<Role> roles = userUpdateDTO.getRoles().stream()
                .map(roleDto -> roleRepository.findById(roleDto.getId())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleDto.getId())))
                .collect(Collectors.toSet());
            user.setRoles(roles);
        }
        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
}
