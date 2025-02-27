package com.qw.qwhomes.domains.proposal.dto;

import com.qw.qwhomes.domains.proposal.data.entity.Proposal;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProposalResponseDTO {
    private Long id;
    private String name;
    private Long apartmentTypeId;
    private String clientInfo;
    private Double totalPrice;
    private Proposal.ProposalStatus status;
    private List<ProposalProductDTO> proposalProducts;
    private List<ProposalFileDTO> proposalFiles;
    private LocalDateTime createdAt;
    private Long createdBy;
    private LocalDateTime updatedAt;
    private Long updatedBy;
}
