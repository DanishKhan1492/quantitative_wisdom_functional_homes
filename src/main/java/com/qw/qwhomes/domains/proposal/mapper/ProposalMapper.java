package com.qw.qwhomes.domains.proposal.mapper;

import com.qw.qwhomes.domains.proposal.data.entity.Proposal;
import com.qw.qwhomes.domains.proposal.data.entity.ProposalProduct;
import com.qw.qwhomes.domains.proposal.data.entity.ProposalFile;
import com.qw.qwhomes.domains.proposal.dto.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProposalMapper {

    @Mapping(target = "apartmentType.id", source = "apartmentTypeId")
    @Mapping(target = "proposalProducts", ignore = true)
    @Mapping(target = "proposalFiles", ignore = true)
    Proposal toEntity(ProposalCreateDTO dto);

    @Mapping(target = "apartmentType.id", source = "apartmentTypeId")
    @Mapping(target = "proposalProducts", ignore = true)
    @Mapping(target = "proposalFiles", ignore = true)
    void updateEntityFromDto(ProposalUpdateDTO dto, @MappingTarget Proposal entity);

    @Mapping(target = "apartmentTypeId", source = "apartmentType.id")
    ProposalResponseDTO toDto(Proposal entity);

    ProposalProductDTO toDto(ProposalProduct entity);

    @Mapping(target = "proposal", ignore = true)
    @Mapping(target = "product.id", source = "productId")
    ProposalProduct toEntity(ProposalProductDTO dto);

    ProposalFileDTO toDto(ProposalFile entity);
}
