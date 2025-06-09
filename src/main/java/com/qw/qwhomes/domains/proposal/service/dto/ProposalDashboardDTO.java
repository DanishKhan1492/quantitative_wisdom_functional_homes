package com.qw.qwhomes.domains.proposal.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProposalDashboardDTO {
    private Long totalProposals;
    private Long totalDraftProposals;
    private Long totalFinalizedProposals;
    private Long totalApprovedProposals;
}
