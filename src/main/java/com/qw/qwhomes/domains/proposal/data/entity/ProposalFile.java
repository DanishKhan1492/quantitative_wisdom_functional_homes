package com.qw.qwhomes.domains.proposal.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "proposal_file")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalFile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "proposal_file_id_seq")
    @SequenceGenerator(name = "proposal_file_id_seq", sequenceName = "proposal_file_id_seq", allocationSize = 1)
    @Column(name = "file_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id")
    private Proposal proposal;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_format", nullable = false)
    private FileFormat fileFormat;

    public enum FileFormat {
        PDF, EXCEL
    }
}
