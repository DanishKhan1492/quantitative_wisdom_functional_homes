package com.qw.qwhomes.domains.proposal.controller;

import com.qw.qwhomes.domains.proposal.data.entity.Proposal;
import com.qw.qwhomes.domains.proposal.data.entity.ProposalProduct;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalDTO;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalDashboardDTO;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalResponseDTO;
import com.qw.qwhomes.domains.proposal.service.ProposalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.qw.qwhomes.common.service.impl.ExcelExportService;
import com.qw.qwhomes.domains.proposal.data.repository.ProposalRepository;
import org.springframework.core.io.InputStreamResource;
import java.io.ByteArrayInputStream;
import java.util.List;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/v1/proposals")
@RequiredArgsConstructor
@Tag(name = "Proposal Management", description = "APIs for managing proposals")
public class ProposalController {

    private final ProposalService proposalService;
    private final ExcelExportService excelExportService;
    private final ProposalRepository proposalRepository;

    private static final String[] PROPOSAL_HEADERS = {
            "ID", "Name", "Client", "Apartment Type", "Status", "Total Price", "Discount",  "Created Date"
    };

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Create a new proposal")
    public ResponseEntity<ProposalResponseDTO> createProposal(@Valid @RequestBody ProposalDTO createDTO) {
        ProposalResponseDTO response = proposalService.createProposal(createDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Update an existing proposal")
    public ResponseEntity<ProposalResponseDTO> updateProposal(@PathVariable Long id, @Valid @RequestBody ProposalDTO updateDTO) {
        ProposalResponseDTO response = proposalService.updateProposal(id, updateDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @Operation(summary = "Get a proposal by ID")
    public ResponseEntity<ProposalResponseDTO> getProposal(@PathVariable Long id) {
        ProposalResponseDTO response = proposalService.getProposal(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @Operation(summary = "Get all proposals with pagination")
    public ResponseEntity<Page<ProposalResponseDTO>> getAllProposals(Pageable pageable) {
        Page<ProposalResponseDTO> response = proposalService.getAllProposals(pageable);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Delete a proposal")
    public ResponseEntity<Void> deleteProposal(@PathVariable Long id) {
        proposalService.deleteProposal(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/finalize")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Finalize a proposal")
    public ResponseEntity<ProposalResponseDTO> finalizeProposal(@PathVariable Long id) {
        ProposalResponseDTO response = proposalService.finalizeProposal(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Approve a proposal")
    public ResponseEntity<ProposalResponseDTO> approveProposal(@PathVariable Long id) {
        ProposalResponseDTO response = proposalService.approveProposal(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/export/pdf")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @Operation(summary = "Export proposal as PDF")
    public ResponseEntity<Resource> exportProposalAsPdf(@PathVariable Long id) throws IOException {
        String filePath = proposalService.exportProposalAsPdf(id);
        Path path = Paths.get(filePath);
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/{id}/export/excel")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @Operation(summary = "Export proposal as Excel")
    public ResponseEntity<Resource> exportProposalAsExcel(@PathVariable Long id) throws IOException {
        String filePath = proposalService.exportProposalAsExcel(id);
        Path path = Paths.get(filePath);
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }


    @GetMapping("/metadata")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get Proposals metadata")
    public ResponseEntity<ProposalDashboardDTO> getProposalMetadata() {
        return ResponseEntity.ok(proposalService.getProposalMetadata());
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping("/export/excel")
    @Operation(summary = "Export all proposals to Excel")
    public ResponseEntity<InputStreamResource> exportAllProposalsToExcel() throws IOException {
        List<Proposal> proposals = proposalRepository.findAll();

        ByteArrayInputStream in = excelExportService.exportToExcel(
                proposals,
                PROPOSAL_HEADERS,
                "Proposals",
                proposal -> new Object[]{
                        proposal.getId(),
                        proposal.getName(),
                        proposal.getClient() != null ? proposal.getClient().getName() : "N/A",
                        proposal.getApartmentType() != null ? proposal.getApartmentType().getName() : "N/A",
                        proposal.getStatus() != null ? proposal.getStatus().name() : "N/A",
                        proposal.getTotalPrice(),
                        proposal.getDiscount(),
                        proposal.getCreatedAt() != null ? proposal.getCreatedAt().toString() : "N/A"
                }
        );

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=proposals.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}
