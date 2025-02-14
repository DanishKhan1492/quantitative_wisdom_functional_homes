package com.qw.qwhomes.domains.colour.controller;

import com.qw.qwhomes.common.dto.PageableResponse;
import com.qw.qwhomes.domains.colour.service.ColourService;
import com.qw.qwhomes.domains.colour.service.dto.ColourDTO;
import com.qw.qwhomes.domains.colour.service.dto.ColourDashboardDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/colours")
@RequiredArgsConstructor
@Tag(name = "Colour Management", description = "APIs for managing colours")
public class ColourController {

    private final ColourService colourService;
    private final MessageSource messageSource;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Create a new colour")
    public ResponseEntity<ColourDTO> createColour(@Valid @RequestBody ColourDTO colourDTO) {
        ColourDTO createdColour = colourService.createColour(colourDTO);
        String successMessage = messageSource.getMessage("colour.created", new Object[]{createdColour.getColourId()}, LocaleContextHolder.getLocale());
        return ResponseEntity.status(HttpStatus.CREATED).header("X-Message", successMessage).body(createdColour);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get a colour by ID")
    public ResponseEntity<ColourDTO> getColourById(@PathVariable Long id) {
        return ResponseEntity.ok(colourService.getColourById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all colours with pagination and search")
    public ResponseEntity<PageableResponse<ColourDTO>> getAllColours(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(new PageableResponse<>(colourService.getAllColours(pageable, search)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Update an existing colour")
    public ResponseEntity<ColourDTO> updateColour(
            @PathVariable Long id,
            @Valid @RequestBody ColourDTO colourDTO) {
        return ResponseEntity.ok(colourService.updateColour(id, colourDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a colour")
    public ResponseEntity<Void> deleteColour(@PathVariable Long id) {
        colourService.deleteColour(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/metadata")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get colour metadata")
    public ResponseEntity<ColourDashboardDTO> getColorMetaData() {
        return ResponseEntity.ok(colourService.getColoursMetaData());
    }
}
