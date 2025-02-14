package com.qw.qwhomes.domains.colour.service;

import com.qw.qwhomes.domains.colour.service.dto.ColourDTO;
import com.qw.qwhomes.domains.colour.service.dto.ColourDashboardDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ColourService {
    ColourDTO createColour(ColourDTO colourDTO);
    ColourDTO getColourById(Long id);
    Page<ColourDTO> getAllColours(Pageable pageable, String search);
    ColourDTO updateColour(Long id, ColourDTO colourDTO);
    void deleteColour(Long id);

    ColourDashboardDTO getColoursMetaData();
}
