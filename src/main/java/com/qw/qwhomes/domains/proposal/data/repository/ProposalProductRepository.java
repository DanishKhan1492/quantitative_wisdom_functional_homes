package com.qw.qwhomes.domains.proposal.data.repository;

import com.qw.qwhomes.domains.proposal.data.entity.ProposalProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProposalProductRepository extends JpaRepository<ProposalProduct, Long> {
}
