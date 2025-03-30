package com.qw.qwhomes.domains.colour.unit_tests;

import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.domains.colour.data.entity.Colour;
import com.qw.qwhomes.domains.colour.data.repository.ColourRepository;
import com.qw.qwhomes.domains.colour.service.dto.ColourDTO;
import com.qw.qwhomes.domains.colour.service.impl.ColourServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ColourUnitTests {

    @Mock
    private ColourRepository colourRepository;

    @InjectMocks
    private ColourServiceImpl colourService;

    private Colour testColour;
    private ColourDTO testColourDTO;

    @BeforeEach
    void setUp() {
        testColour = new Colour();
        testColour.setColourId(1L);
        testColour.setName("Test Red");
        testColour.setCode("#FF0000");
        testColour.setDescription("Test red colour");

        testColourDTO = new ColourDTO();
        testColourDTO.setName("Test Red");
        testColourDTO.setCode("#FF0000");
        testColourDTO.setDescription("Test red colour");
    }

    @Test
    void getAllColours_ShouldReturnPageOfColours() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Colour> colourPage = new PageImpl<>(Collections.singletonList(testColour));
        
        when(colourRepository.findAll(pageable)).thenReturn(colourPage);

        Page<ColourDTO> result = colourService.getAllColours(pageable, "");

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testColour.getName(), result.getContent().getFirst().getName());
    }

    @Test
    void getColourById_WhenExists_ShouldReturnColour() {
        when(colourRepository.findById(1L)).thenReturn(Optional.of(testColour));

        ColourDTO result = colourService.getColourById(1L);

        assertNotNull(result);
        assertEquals(testColour.getName(), result.getName());
    }

    @Test
    void getColourById_WhenNotExists_ShouldThrowException() {
        when(colourRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> colourService.getColourById(1L));
    }

    @Test
    void createColour_ShouldReturnCreatedColour() {
        when(colourRepository.save(any(Colour.class))).thenReturn(testColour);

        ColourDTO result = colourService.createColour(testColourDTO);

        assertNotNull(result);
        assertEquals(testColourDTO.getName(), result.getName());
        verify(colourRepository, times(1)).save(any(Colour.class));
    }

    @Test
    void updateColour_WhenExists_ShouldReturnUpdatedColour() {
        when(colourRepository.findById(1L)).thenReturn(Optional.of(testColour));
        when(colourRepository.save(any(Colour.class))).thenReturn(testColour);

        ColourDTO result = colourService.updateColour(1L, testColourDTO);

        assertNotNull(result);
        assertEquals(testColourDTO.getName(), result.getName());
        verify(colourRepository, times(1)).save(any(Colour.class));
    }

    @Test
    void updateColour_WhenNotExists_ShouldThrowException() {
        when(colourRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> colourService.updateColour(1L, testColourDTO));
    }

    @Test
    void deleteColour_WhenExists_ShouldDeleteSuccessfully() {
        when(colourRepository.findById(1L)).thenReturn(Optional.of(testColour));
        doNothing().when(colourRepository).delete(any(Colour.class));

        assertDoesNotThrow(() -> colourService.deleteColour(1L));
        verify(colourRepository, times(1)).delete(any(Colour.class));
    }

    @Test
    void deleteColour_WhenNotExists_ShouldThrowException() {
        when(colourRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> colourService.deleteColour(1L));
    }
}
