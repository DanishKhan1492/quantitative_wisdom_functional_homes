package com.qw.qwhomes.domains.proposal.service.dto;

import com.qw.qwhomes.domains.proposal.data.entity.ProposalFile;
import lombok.Data;

@Data
public class ProposalFileDTO {
    private Long id;
    private String filePath;
    private ProposalFile.FileFormat fileFormat;
}
