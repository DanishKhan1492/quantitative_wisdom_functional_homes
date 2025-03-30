package com.qw.qwhomes.domains.proposal.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ProposalDTO {
    @NotBlank(message = "proposal.name.required")
    @Size(min = 3, max = 255, message = "proposal.name.size")
    private String name;

    @NotNull(message = "proposal.apartmentType.required")
    private Long apartmentTypeId;

    @NotNull(message = "proposal.client.required")
    private Long clientId;

    @NotEmpty(message = "proposal.products.required")
    @NotNull(message = "proposal.products.required")
    @Size(min = 1, message = "proposal.products.min")
    private List<ProposalProductDTO> proposalProducts;
}
