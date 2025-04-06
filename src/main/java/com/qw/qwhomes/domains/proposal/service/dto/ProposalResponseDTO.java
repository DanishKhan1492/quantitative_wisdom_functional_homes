package com.qw.qwhomes.domains.proposal.service.dto;

import com.qw.qwhomes.domains.proposal.data.entity.Proposal;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProposalResponseDTO {
    private Long id;
    private String name;
    private Long apartmentTypeId;
    private String apartmentName;
    private Long clientId;
    private String clientName;
    private Double totalPrice;
    private Double discount;
    private Proposal.ProposalStatus status;
    private List<ProposalProductDTO> proposalProducts;
    private List<ProposalFileDTO> proposalFiles;
    private LocalDateTime createdAt;
    private Long createdBy;
    private LocalDateTime updatedAt;
    private Long updatedBy;
}
