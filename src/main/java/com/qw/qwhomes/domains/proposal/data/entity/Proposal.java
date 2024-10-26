package com.qw.qwhomes.domains.proposal.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "proposal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Proposal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "proposal_id_seq")
    @SequenceGenerator(name = "proposal_id_seq", sequenceName = "proposal_id_seq", allocationSize = 1)
    @Column(name = "proposal_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_type_id")
    private ApartmentType apartmentType;

    @Column(name = "client_info")
    private String clientInfo;

    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProposalStatus status;

    @OneToMany(mappedBy = "proposal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProposalProduct> proposalProducts = new ArrayList<>();

    @OneToMany(mappedBy = "proposal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProposalFile> proposalFiles = new ArrayList<>();

    public enum ProposalStatus {
        DRAFT, FINALIZED, APPROVED
    }
}
