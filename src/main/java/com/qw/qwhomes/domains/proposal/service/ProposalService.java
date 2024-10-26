package com.qw.qwhomes.domains.proposal.service;

import com.qw.qwhomes.domains.proposal.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProposalService {
    ProposalResponseDTO createProposal(ProposalCreateDTO createDTO);
    ProposalResponseDTO updateProposal(Long id, ProposalUpdateDTO updateDTO);
    ProposalResponseDTO getProposal(Long id);
    Page<ProposalResponseDTO> getAllProposals(Pageable pageable);
    void deleteProposal(Long id);
    ProposalResponseDTO finalizeProposal(Long id);
    ProposalResponseDTO approveProposal(Long id);
    String exportProposalAsPdf(Long id);
    String exportProposalAsExcel(Long id);
}
