package com.qw.qwhomes.domains.material.service;

import com.qw.qwhomes.domains.material.dto.MaterialDTO;
import com.qw.qwhomes.domains.material.dto.MaterialResponseDTO;
import com.qw.qwhomes.domains.material.dto.MaterialUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MaterialService {

    MaterialDTO createMaterial(MaterialDTO createDTO);

    MaterialDTO getMaterialById(Long id);

    Page<MaterialDTO> getAllMaterials(Pageable pageable);

    MaterialDTO updateMaterial(Long id, MaterialDTO updateDTO);

    void deleteMaterial(Long id);
}
