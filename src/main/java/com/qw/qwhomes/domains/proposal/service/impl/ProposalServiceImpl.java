package com.qw.qwhomes.domains.proposal.service.impl;

import com.qw.qwhomes.common.exceptions.BusinessException;
import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import com.qw.qwhomes.domains.apartmenttype.data.repository.ApartmentTypeRepository;
import com.qw.qwhomes.domains.client.data.entity.Client;
import com.qw.qwhomes.domains.client.data.repository.ClientRepository;
import com.qw.qwhomes.domains.product.data.entity.Product;
import com.qw.qwhomes.domains.product.data.repository.ProductRepository;
import com.qw.qwhomes.domains.proposal.data.entity.Proposal;
import com.qw.qwhomes.domains.proposal.data.entity.ProposalFile;
import com.qw.qwhomes.domains.proposal.data.entity.ProposalProduct;
import com.qw.qwhomes.domains.proposal.data.repository.ProposalRepository;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalDTO;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalDashboardDTO;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalProductDTO;
import com.qw.qwhomes.domains.proposal.service.dto.ProposalResponseDTO;
import com.qw.qwhomes.domains.proposal.service.mapper.ProposalMapper;
import com.qw.qwhomes.domains.proposal.service.ProposalService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProposalServiceImpl implements ProposalService {

    private final ProposalRepository proposalRepository;
    private final ApartmentTypeRepository apartmentTypeRepository;
    private final ProductRepository productRepository;
    private final ProposalMapper proposalMapper;
    private final MessageSource messageSource;
    private final ClientRepository clientRepository;

    @Value("${proposal.export.path}")
    private String exportPath;

    @Override
    @Transactional
    public ProposalResponseDTO createProposal(ProposalDTO createDTO) {
        Proposal proposal = proposalMapper.toEntity(createDTO);
        proposal.setStatus(Proposal.ProposalStatus.DRAFT);

        ApartmentType apartmentType = apartmentTypeRepository.findById(createDTO.getApartmentTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("apartmentType.notFound", new Object[]{createDTO.getApartmentTypeId()}, Locale.getDefault())));
        proposal.setApartmentType(apartmentType);

        Client client = clientRepository.findById(createDTO.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("client.notFound", new Object[]{createDTO.getClientId()}, Locale.getDefault())));
        proposal.setClient(client);

        List<ProposalProduct> proposalProducts = createProposalProducts(createDTO.getProposalProducts(), proposal);
        proposal.setProposalProducts(proposalProducts);

        Double totalPrice = calculateTotalPrice(proposalProducts);
        if (createDTO.getDiscount() != null && createDTO.getDiscount() > 0) {
            totalPrice = totalPrice - (totalPrice * createDTO.getDiscount() / 100);
        }
        proposal.setTotalPrice(totalPrice);

        Proposal savedProposal = proposalRepository.save(proposal);
        return proposalMapper.toDto(savedProposal);
    }

    @Override
    @Transactional
    public ProposalResponseDTO updateProposal(Long id, ProposalDTO updateDTO) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("proposal.notFound", new Object[]{id}, Locale.getDefault())));

        if (proposal.getStatus() != Proposal.ProposalStatus.DRAFT) {
            throw new BusinessException("Only draft proposals can be updated");
        }

        proposalMapper.updateEntityFromDto(updateDTO, proposal);

        ApartmentType apartmentType = apartmentTypeRepository.findById(updateDTO.getApartmentTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("apartmentType.notFound", new Object[]{updateDTO.getApartmentTypeId()}, Locale.getDefault())));
        proposal.setApartmentType(apartmentType);

        updateProposalProducts(updateDTO.getProposalProducts(), proposal);

        Double totalPrice = calculateTotalPrice(proposal.getProposalProducts());
        if (updateDTO.getDiscount() != null && updateDTO.getDiscount() > 0 && !updateDTO.getDiscount().equals(proposal.getDiscount())) {
            totalPrice = totalPrice - (totalPrice * updateDTO.getDiscount() / 100);
        }
        proposal.setTotalPrice(totalPrice);

        Proposal updatedProposal = proposalRepository.save(proposal);
        return proposalMapper.toDto(updatedProposal);
    }

    @Override
    @Transactional(readOnly = true)
    public ProposalResponseDTO getProposal(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("proposal.notFound", new Object[]{id}, Locale.getDefault())));
        return proposalMapper.toDto(proposal);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProposalResponseDTO> getAllProposals(Pageable pageable) {
        return proposalRepository.findAll(pageable).map(proposalMapper::toDto);
    }

    @Override
    @Transactional
    public void deleteProposal(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("proposal.notFound", new Object[]{id}, Locale.getDefault())));

        if (proposal.getStatus() != Proposal.ProposalStatus.DRAFT) {
            throw new BusinessException(messageSource.getMessage("proposal.flow.exception", new Object[]{Proposal.ProposalStatus.DRAFT, "deleted"}, Locale.getDefault()));
        }

        proposalRepository.delete(proposal);
    }

    @Override
    @Transactional
    public ProposalResponseDTO finalizeProposal(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("proposal.notFound", new Object[]{id}, Locale.getDefault())));

        if (proposal.getStatus() != Proposal.ProposalStatus.DRAFT) {
            throw new BusinessException(messageSource.getMessage("proposal.flow.exception", new Object[]{Proposal.ProposalStatus.DRAFT, "finalized"}, Locale.getDefault()));
        }

        proposal.setStatus(Proposal.ProposalStatus.FINALIZED);
        Proposal finalizedProposal = proposalRepository.save(proposal);
        return proposalMapper.toDto(finalizedProposal);
    }

    @Override
    @Transactional
    public ProposalResponseDTO approveProposal(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("proposal.notFound", new Object[]{id}, Locale.getDefault())));

        if (proposal.getStatus() != Proposal.ProposalStatus.FINALIZED) {
            throw new BusinessException(messageSource.getMessage("proposal.flow.exception", new Object[]{Proposal.ProposalStatus.FINALIZED, "approved"}, Locale.getDefault()));
        }

        proposal.setStatus(Proposal.ProposalStatus.APPROVED);
        Proposal approvedProposal = proposalRepository.save(proposal);
        return proposalMapper.toDto(approvedProposal);
    }

    @Override
    @Transactional
    public String exportProposalAsPdf(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("proposal.notFound", new Object[]{id}, Locale.getDefault())));

        try {
            String pdfPath = generatePdf(proposal);

            ProposalFile proposalFile = ProposalFile.builder()
                    .proposal(proposal)
                    .filePath(pdfPath)
                    .fileFormat(ProposalFile.FileFormat.PDF)
                    .build();

            proposal.getProposalFiles().add(proposalFile);
            proposalRepository.save(proposal);

            return pdfPath;
        } catch (IOException e) {
            throw new BusinessException("Failed to generate PDF: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public String exportProposalAsExcel(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("proposal.notFound", new Object[]{id}, Locale.getDefault())));

        try {
            String excelPath = generateExcel(proposal);

            ProposalFile proposalFile = ProposalFile.builder()
                    .proposal(proposal)
                    .filePath(excelPath)
                    .fileFormat(ProposalFile.FileFormat.EXCEL)
                    .build();

            proposal.getProposalFiles().add(proposalFile);
            proposalRepository.save(proposal);

            return excelPath;
        } catch (IOException e) {
            throw new BusinessException("Failed to generate Excel: " + e.getMessage());
        }
    }

    @Override
    public ProposalDashboardDTO getProposalMetadata() {
        return proposalRepository.getProposalMetadata();
    }

    private List<ProposalProduct> createProposalProducts(List<ProposalProductDTO> productDTOs, Proposal proposal) {
        return productDTOs.stream().map(dto -> {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("product.notFound", new Object[]{dto.getProductId()}, Locale.getDefault())));

            ProposalProduct proposalProduct = proposalMapper.toEntity(dto);
            proposalProduct.setProposal(proposal);
            proposalProduct.setProduct(product);
            proposalProduct.setPrice(product.getPrice());
            proposalProduct.setTotalPrice(product.getPrice() * dto.getQuantity());

            return proposalProduct;
        }).collect(Collectors.toList());
    }

    private Double calculateTotalPrice(List<ProposalProduct> proposalProducts) {
        return proposalProducts.stream()
                .map(ProposalProduct::getTotalPrice)
                .reduce(0.0, Double::sum);
    }
    private String generatePdf(Proposal proposal) throws IOException {
        String fileName = "proposal_" + proposal.getId() + "_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + ".pdf";
        String filePath = exportPath + File.separator + fileName;

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            float margin = 50;
            float yStart = 650;
            float yPosition = yStart;
            float bottomMargin = 70;
            float rowHeight = 20;

            while (true) {
                try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                    if (yPosition == yStart) {
                        // Title
                        contentStream.beginText();
                        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
                        contentStream.newLineAtOffset(50, 750);
                        contentStream.showText("Proposal: " + proposal.getName());
                        contentStream.endText();

                        // Proposal details
                        contentStream.beginText();
                        contentStream.setFont(PDType1Font.HELVETICA, 12);
                        contentStream.newLineAtOffset(50, 720);
                        contentStream.showText("Apartment Type: " + proposal.getApartmentType().getName());
                        contentStream.newLineAtOffset(0, -20);
                        contentStream.showText("Status: " + proposal.getStatus());
                        contentStream.newLineAtOffset(0, -20);
                        contentStream.showText("Total Price: AED" + proposal.getTotalPrice());
                        contentStream.endText();

                        // Table header
                        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
                        contentStream.beginText();
                        contentStream.newLineAtOffset(margin, yPosition);
                        contentStream.showText("Product");
                        contentStream.newLineAtOffset(200, 0);
                        contentStream.showText("Quantity");
                        contentStream.newLineAtOffset(100, 0);
                        contentStream.showText("Price");
                        contentStream.newLineAtOffset(100, 0);
                        contentStream.showText("Total");
                        contentStream.endText();

                        yPosition -= rowHeight;
                    }

                    // Table content
                    contentStream.setFont(PDType1Font.HELVETICA, 12);
                    for (ProposalProduct product : proposal.getProposalProducts()) {
                        if (yPosition < bottomMargin) {
                            break;
                        }

                        contentStream.beginText();
                        contentStream.newLineAtOffset(margin, yPosition);
                        contentStream.showText(product.getProduct().getName());
                        contentStream.newLineAtOffset(200, 0);
                        contentStream.showText(String.valueOf(product.getQuantity()));
                        contentStream.newLineAtOffset(100, 0);
                        contentStream.showText("AED " + product.getPrice());
                        contentStream.newLineAtOffset(100, 0);
                        contentStream.showText("AED " + product.getTotalPrice());
                        contentStream.endText();

                        yPosition -= rowHeight;
                    }
                }

                if (yPosition >= bottomMargin) {
                    break;
                }

                page = new PDPage();
                document.addPage(page);
                yPosition = yStart;
            }

            document.save(filePath);
        }

        return filePath;
    }

    private String generateExcel(Proposal proposal) throws IOException {
        String fileName = "proposal_" + proposal.getId() + "_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + ".xlsx";
        String filePath = exportPath + File.separator + fileName;

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Proposal");

            // Create cell styles
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // Proposal details
            Row titleRow = sheet.createRow(0);
            titleRow.createCell(0).setCellValue("Proposal: " + proposal.getName());
            titleRow.getCell(0).setCellStyle(headerStyle);

            Row detailsRow1 = sheet.createRow(1);
            detailsRow1.createCell(0).setCellValue("Apartment Type: " + proposal.getApartmentType().getName());

            Row detailsRow2 = sheet.createRow(2);
            detailsRow2.createCell(0).setCellValue("Status: " + proposal.getStatus());

            Row detailsRow3 = sheet.createRow(3);
            detailsRow3.createCell(0).setCellValue("Total Price: AED " + proposal.getTotalPrice());

            // Product table header
            Row headerRow = sheet.createRow(5);
            headerRow.createCell(0).setCellValue("Product");
            headerRow.createCell(1).setCellValue("Quantity");
            headerRow.createCell(2).setCellValue("Price");
            headerRow.createCell(3).setCellValue("Total");
            headerRow.forEach(cell -> cell.setCellStyle(headerStyle));

            // Product table content
            int rowNum = 6;
            for (ProposalProduct product : proposal.getProposalProducts()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(product.getProduct().getName());
                row.createCell(1).setCellValue(product.getQuantity());
                row.createCell(2).setCellValue(product.getPrice());
                row.createCell(3).setCellValue(product.getTotalPrice());
            }

            // Auto-size columns
            for (int i = 0; i < 4; i++) {
                sheet.autoSizeColumn(i);
            }

            // Write the workbook to a file
            try (FileOutputStream outputStream = new FileOutputStream(filePath)) {
                workbook.write(outputStream);
            }
        }

        return filePath;
    }

    private void updateProposalProducts(List<ProposalProductDTO> productDTOs, Proposal proposal) {
        // remove those which are not present in productDTOs
        proposal.getProposalProducts().removeIf(proProduct -> productDTOs.stream().noneMatch(prod -> prod.getProductId().equals(proProduct.getProduct().getProductId())));

        productDTOs.forEach(proProduct -> {
            if (proposal.getProposalProducts().stream().noneMatch(pp -> proProduct.getProductId().equals(pp.getProduct().getProductId()))) {
                Product product = productRepository.findById(proProduct.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("product.notFound", new Object[]{proProduct.getProductId()}, Locale.getDefault())));

                ProposalProduct proposalProduct = proposalMapper.toEntity(proProduct);
                proposalProduct.setProposal(proposal);
                proposalProduct.setProduct(product);
                proposalProduct.setPrice(product.getPrice());
                proposalProduct.setTotalPrice(product.getPrice() * proProduct.getQuantity());

                proposal.getProposalProducts().add(proposalProduct);
            } else {
                ProposalProduct proposalProduct = proposal.getProposalProducts().stream().filter(pp -> proProduct.getProductId().equals(pp.getProduct().getProductId())).findFirst().get();
                if (!proProduct.getQuantity().equals(proposalProduct.getQuantity())) {
                    proposalProduct.setQuantity(proProduct.getQuantity());
                    proposalProduct.setTotalPrice(proProduct.getQuantity() * proposalProduct.getPrice());

                    // now remove the same product from list and add updated one
                    proposal.getProposalProducts().removeIf(pp -> proProduct.getProductId().equals(pp.getProduct().getProductId()));
                    proposal.getProposalProducts().add(proposalProduct);
                }
            }
        });
    }
}
