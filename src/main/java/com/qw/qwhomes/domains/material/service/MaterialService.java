package com.qw.qwhomes.domains.material.service;

import com.qw.qwhomes.domains.material.dto.MaterialCreateDTO;
import com.qw.qwhomes.domains.material.dto.MaterialResponseDTO;
import com.qw.qwhomes.domains.material.dto.MaterialUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MaterialService {

    MaterialResponseDTO createMaterial(MaterialCreateDTO createDTO);

    MaterialResponseDTO getMaterialById(Long id);

    Page<MaterialResponseDTO> getAllMaterials(Pageable pageable);

    MaterialResponseDTO updateMaterial(Long id, MaterialUpdateDTO updateDTO);

    void deleteMaterial(Long id);
}
