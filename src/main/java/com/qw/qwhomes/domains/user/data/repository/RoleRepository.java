package com.qw.qwhomes.domains.user.data.repository;

import com.qw.qwhomes.domains.user.data.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
