package com.qw.qwhomes.domains.user.service;

import com.qw.qwhomes.domains.user.dto.UserCreateDTO;
import com.qw.qwhomes.domains.user.dto.UserResponseDTO;
import com.qw.qwhomes.domains.user.dto.UserUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponseDTO createUser(UserCreateDTO userCreateDTO);
    UserResponseDTO getUserById(Long id);
    Page<UserResponseDTO> getAllUsers(Pageable pageable);
    UserResponseDTO updateUser(Long id, UserUpdateDTO userUpdateDTO);
    void deleteUser(Long id);
}
