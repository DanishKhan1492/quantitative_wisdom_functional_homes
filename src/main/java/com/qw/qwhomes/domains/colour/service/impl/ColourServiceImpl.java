package com.qw.qwhomes.domains.colour.service.impl;

import com.qw.qwhomes.common.exceptions.ResourceDuplicateException;
import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.config.QWContext;
import com.qw.qwhomes.domains.colour.data.entity.Colour;
import com.qw.qwhomes.domains.colour.data.repository.ColourRepository;
import com.qw.qwhomes.domains.colour.service.ColourService;
import com.qw.qwhomes.domains.colour.service.dto.ColourDTO;
import com.qw.qwhomes.domains.colour.service.dto.ColourDashboardDTO;
import com.qw.qwhomes.domains.colour.service.mapper.ColourMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ColourServiceImpl implements ColourService {

    private final ColourRepository colourRepository;
    private final ColourMapper colourMapper;
    private final MessageSource messageSource;

    @Override
    @Transactional
    public ColourDTO createColour(ColourDTO colourDTO) {

        var isColourAlreadyPresent = colourRepository.existsByNameIgnoreCase(colourDTO.getName());
        if (isColourAlreadyPresent) {
            throw new ResourceDuplicateException(messageSource.getMessage("colour.duplicate", new Object[]{colourDTO.getName()}, Locale.getDefault()));
        }

        Colour colour = colourMapper.toEntity(colourDTO);
        colour.setCreatedBy(QWContext.get().getUserId());
        return colourMapper.toDto(colourRepository.save(colour));
    }

    @Override
    @Transactional(readOnly = true)
    public ColourDTO getColourById(Long id) {
        return colourRepository.findById(id)
                .map(colourMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException(
                        messageSource.getMessage("colour.notFound", new Object[]{id}, Locale.getDefault())
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ColourDTO> getAllColours(Pageable pageable, String search) {
        Specification<Colour> spec = (root, query, cb) -> {
            if (search == null || search.isEmpty()) {
                return null;
            }
            return cb.or(
                    cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("code")), "%" + search.toLowerCase() + "%")
            );
        };
        return colourRepository.findAll(spec, pageable).map(colourMapper::toDto);
    }

    @Override
    @Transactional
    public ColourDTO updateColour(Long id, ColourDTO colourDTO) {
        Colour colour = colourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        messageSource.getMessage("colour.notFound", new Object[]{id}, Locale.getDefault())
                ));
        if (!colourDTO.getName().equals(colour.getName())) {
            var isColourAlreadyPresent = colourRepository.existsByNameIgnoreCase(colourDTO.getName());
            if (isColourAlreadyPresent) {
                throw new ResourceDuplicateException(messageSource.getMessage("colour.duplicate", new Object[]{colourDTO.getName()}, Locale.getDefault()));
            }
        }
        colourMapper.updateEntityFromDto(colourDTO, colour);
        colour.setUpdatedBy(QWContext.get().getUserId());
        return colourMapper.toDto(colourRepository.save(colour));
    }

    @Override
    @Transactional
    public void deleteColour(Long id) {
        if (!colourRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    messageSource.getMessage("colour.notFound", new Object[]{id}, Locale.getDefault())
            );
        }
        colourRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public ColourDashboardDTO getColoursMetaData() {
        return colourRepository.getColoursMetaData();
    }
}
