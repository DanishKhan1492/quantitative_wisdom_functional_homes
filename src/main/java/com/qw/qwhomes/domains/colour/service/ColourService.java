package com.qw.qwhomes.domains.colour.service;

import com.qw.qwhomes.domains.colour.service.dto.ColourRequestDTO;
import com.qw.qwhomes.domains.colour.service.dto.ColourResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ColourService {
    ColourResponseDTO createColour(ColourRequestDTO colourRequestDTO);
    ColourResponseDTO getColourById(Long id);
    Page<ColourResponseDTO> getAllColours(Pageable pageable, String search);
    ColourResponseDTO updateColour(Long id, ColourRequestDTO colourRequestDTO);
    void deleteColour(Long id);
}
