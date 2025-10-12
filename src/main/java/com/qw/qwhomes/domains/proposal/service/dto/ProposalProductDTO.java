package com.qw.qwhomes.domains.proposal.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProposalProductDTO {

    private Integer id;

    @NotNull(message = "proposal.product.id.required")
    private Long productId;

    @NotNull(message = "proposal.product.quantity.required")
    @Positive(message = "proposal.product.quantity.min")
    private Integer quantity;

    private Double totalPrice;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String name;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String sku;

    private Double supplierDiscount;
}
