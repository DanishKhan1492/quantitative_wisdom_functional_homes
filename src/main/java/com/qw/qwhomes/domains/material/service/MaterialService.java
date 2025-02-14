package com.qw.qwhomes.domains.material.service;

import com.qw.qwhomes.domains.material.service.dto.MaterialDTO;
import com.qw.qwhomes.domains.material.service.dto.MaterialDashboardDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MaterialService {

    MaterialDTO createMaterial(MaterialDTO createDTO);

    MaterialDTO getMaterialById(Long id);

    Page<MaterialDTO> getAllMaterials(Pageable pageable);

    MaterialDTO updateMaterial(Long id, MaterialDTO updateDTO);

    void deleteMaterial(Long id);

    MaterialDashboardDTO getMaterialsMetaData();
}
