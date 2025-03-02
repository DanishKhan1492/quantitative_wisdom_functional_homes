package com.qw.qwhomes.domains.proposal.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProposalProductDTO {
    @NotNull(message = "proposal.product.id.required")
    private Long productId;

    @NotNull(message = "proposal.product.quantity.required")
    @Positive(message = "proposal.product.quantity.min")
    private Integer quantity;

    private Double totalPrice;
}
