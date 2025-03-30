package com.qw.qwhomes.domains.proposal.data.repository;

import com.qw.qwhomes.domains.proposal.data.entity.Proposal;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalDashboardDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long>, JpaSpecificationExecutor<Proposal> {

    @Query("SELECT new com.qw.qwhomes.domains.proposal.service.dto.ProposalDashboardDTO(COUNT(p)) FROM Proposal p")
    ProposalDashboardDTO getProposalMetadata();
}
