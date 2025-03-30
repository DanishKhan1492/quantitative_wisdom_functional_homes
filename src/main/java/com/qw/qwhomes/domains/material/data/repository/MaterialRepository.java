package com.qw.qwhomes.domains.material.data.repository;

import com.qw.qwhomes.domains.material.data.entity.Material;
import com.qw.qwhomes.domains.material.service.dto.MaterialDashboardDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long>, JpaSpecificationExecutor<Material> {
    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT new com.qw.qwhomes.domains.material.service.dto.MaterialDashboardDTO(COUNT(m)) FROM Material m")
    MaterialDashboardDTO getMaterialsMetaData();
}
