package com.qw.qwhomes.domains.proposal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ProposalCreateDTO {
    @NotBlank(message = "Proposal name is required")
    @Size(max = 255, message = "Proposal name must not exceed 255 characters")
    private String name;

    @NotNull(message = "Apartment type ID is required")
    private Long apartmentTypeId;

    @NotNull(message = "Client info is required")
    private String clientInfo;

    @NotNull(message = "At least one product is required")
    @Size(min = 1, message = "At least one product is required")
    private List<ProposalProductDTO> proposalProducts;
}
