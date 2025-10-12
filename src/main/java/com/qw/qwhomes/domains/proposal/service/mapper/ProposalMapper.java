package com.qw.qwhomes.domains.proposal.service.mapper;

import com.qw.qwhomes.domains.proposal.data.entity.Proposal;
import com.qw.qwhomes.domains.proposal.data.entity.ProposalFile;
import com.qw.qwhomes.domains.proposal.data.entity.ProposalProduct;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalDTO;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalFileDTO;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalProductDTO;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProposalMapper {

    @Mapping(target = "apartmentType.apartmentId", source = "apartmentTypeId")
    @Mapping(target = "proposalProducts", ignore = true)
    @Mapping(target = "proposalFiles", ignore = true)
    Proposal toEntity(ProposalDTO dto);

    @Mapping(target = "apartmentType.apartmentId", source = "apartmentTypeId")
    @Mapping(target = "proposalProducts", ignore = true)
    @Mapping(target = "proposalFiles", ignore = true)
    void updateEntityFromDto(ProposalDTO dto, @MappingTarget Proposal entity);

    @Mapping(target = "clientId", source = "client.clientId")
    @Mapping(target = "clientName", source = "client.name")
    @Mapping(target = "apartmentTypeId", source = "apartmentType.apartmentId")
    @Mapping(target = "apartmentName", source = "apartmentType.name")
    ProposalResponseDTO toDto(Proposal entity);

    @Mapping(target = "name", source = "product.name")
    @Mapping(target = "sku", source = "product.sku")
    @Mapping(target = "productId", source = "product.productId")
    @Mapping(target = "supplierDiscount", source = "product.supplier.supplierDiscount")
    ProposalProductDTO toDto(ProposalProduct entity);


    ProposalProduct toEntity(ProposalProductDTO dto);

    ProposalFileDTO toDto(ProposalFile entity);
}
