package com.qw.qwhomes.domains.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UserUpdateDTO {
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @Email(message = "Invalid email format")
    private String email;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Set<RoleDto> roles;
}
