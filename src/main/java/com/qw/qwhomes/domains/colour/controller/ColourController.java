package com.qw.qwhomes.domains.colour.controller;

import com.qw.qwhomes.common.dto.PageableResponse;
import com.qw.qwhomes.domains.colour.service.ColourService;
import com.qw.qwhomes.domains.colour.service.dto.ColourRequestDTO;
import com.qw.qwhomes.domains.colour.service.dto.ColourResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/colours")
@RequiredArgsConstructor
@Tag(name = "Colour Management", description = "APIs for managing colours")
public class ColourController {

    private final ColourService colourService;
    private final MessageSource messageSource;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new colour")
    public ResponseEntity<ColourResponseDTO> createColour(@Valid @RequestBody ColourRequestDTO colourRequestDTO) {
        ColourResponseDTO createdColour = colourService.createColour(colourRequestDTO);
        String successMessage = messageSource.getMessage("colour.created", new Object[]{createdColour.getId()}, LocaleContextHolder.getLocale());
        return ResponseEntity.status(HttpStatus.CREATED).header("X-Message", successMessage).body(createdColour);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get a colour by ID")
    public ResponseEntity<ColourResponseDTO> getColourById(@PathVariable Long id) {
        return ResponseEntity.ok(colourService.getColourById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all colours with pagination and search")
    public ResponseEntity<PageableResponse<ColourResponseDTO>> getAllColours(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(new PageableResponse<>(colourService.getAllColours(pageable, search)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing colour")
    public ResponseEntity<ColourResponseDTO> updateColour(
            @PathVariable Long id,
            @Valid @RequestBody ColourRequestDTO colourRequestDTO) {
        return ResponseEntity.ok(colourService.updateColour(id, colourRequestDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a colour")
    public ResponseEntity<Void> deleteColour(@PathVariable Long id) {
        colourService.deleteColour(id);
        return ResponseEntity.noContent().build();
    }
}
