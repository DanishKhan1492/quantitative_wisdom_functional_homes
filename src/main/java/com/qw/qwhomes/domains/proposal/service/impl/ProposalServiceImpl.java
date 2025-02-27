package com.qw.qwhomes.domains.proposal.service.impl;

import com.qw.qwhomes.common.exceptions.BusinessException;
import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import com.qw.qwhomes.domains.apartmenttype.data.repository.ApartmentTypeRepository;
import com.qw.qwhomes.domains.product.data.entity.Product;
import com.qw.qwhomes.domains.product.data.repository.ProductRepository;
import com.qw.qwhomes.domains.proposal.data.entity.Proposal;
import com.qw.qwhomes.domains.proposal.data.entity.ProposalFile;
import com.qw.qwhomes.domains.proposal.data.entity.ProposalProduct;
import com.qw.qwhomes.domains.proposal.data.repository.ProposalRepository;
import com.qw.qwhomes.domains.proposal.dto.ProposalCreateDTO;
import com.qw.qwhomes.domains.proposal.dto.ProposalProductDTO;
import com.qw.qwhomes.domains.proposal.dto.ProposalResponseDTO;
import com.qw.qwhomes.domains.proposal.dto.ProposalUpdateDTO;
import com.qw.qwhomes.domains.proposal.mapper.ProposalMapper;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProposalServiceImpl implements ProposalService {

    private final ProposalRepository proposalRepository;
    private final ApartmentTypeRepository apartmentTypeRepository;
    private final ProductRepository productRepository;
    private final ProposalMapper proposalMapper;

    @Value("${proposal.export.path}")
    private String exportPath;

    @Override
    @Transactional
    public ProposalResponseDTO createProposal(ProposalCreateDTO createDTO) {
        Proposal proposal = proposalMapper.toEntity(createDTO);
        proposal.setStatus(Proposal.ProposalStatus.DRAFT);

        ApartmentType apartmentType = apartmentTypeRepository.findById(createDTO.getApartmentTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("ApartmentType not found"));
        proposal.setApartmentType(apartmentType);

        List<ProposalProduct> proposalProducts = createProposalProducts(createDTO.getProposalProducts(), proposal);
        proposal.setProposalProducts(proposalProducts);

        Double totalPrice = calculateTotalPrice(proposalProducts);
        proposal.setTotalPrice(totalPrice);

        Proposal savedProposal = proposalRepository.save(proposal);
        return proposalMapper.toDto(savedProposal);
    }

    @Override
    @Transactional
    public ProposalResponseDTO updateProposal(Long id, ProposalUpdateDTO updateDTO) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (proposal.getStatus() != Proposal.ProposalStatus.DRAFT) {
            throw new BusinessException("Only draft proposals can be updated");
        }

        proposalMapper.updateEntityFromDto(updateDTO, proposal);

        ApartmentType apartmentType = apartmentTypeRepository.findById(updateDTO.getApartmentTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("ApartmentType not found"));
        proposal.setApartmentType(apartmentType);

        proposal.getProposalProducts().clear();
        List<ProposalProduct> proposalProducts = createProposalProducts(updateDTO.getProposalProducts(), proposal);
        proposal.getProposalProducts().addAll(proposalProducts);

        Double totalPrice = calculateTotalPrice(proposalProducts);
        proposal.setTotalPrice(totalPrice);

        Proposal updatedProposal = proposalRepository.save(proposal);
        return proposalMapper.toDto(updatedProposal);
    }

    @Override
    @Transactional(readOnly = true)
    public ProposalResponseDTO getProposal(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));
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
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (proposal.getStatus() != Proposal.ProposalStatus.DRAFT) {
            throw new BusinessException("Only draft proposals can be deleted");
        }

        proposalRepository.delete(proposal);
    }

    @Override
    @Transactional
    public ProposalResponseDTO finalizeProposal(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (proposal.getStatus() != Proposal.ProposalStatus.DRAFT) {
            throw new BusinessException("Only draft proposals can be finalized");
        }

        proposal.setStatus(Proposal.ProposalStatus.FINALIZED);
        Proposal finalizedProposal = proposalRepository.save(proposal);
        return proposalMapper.toDto(finalizedProposal);
    }

    @Override
    @Transactional
    public ProposalResponseDTO approveProposal(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (proposal.getStatus() != Proposal.ProposalStatus.FINALIZED) {
            throw new BusinessException("Only finalized proposals can be approved");
        }

        proposal.setStatus(Proposal.ProposalStatus.APPROVED);
        Proposal approvedProposal = proposalRepository.save(proposal);
        return proposalMapper.toDto(approvedProposal);
    }

    @Override
    @Transactional
    public String exportProposalAsPdf(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

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
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

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

    private List<ProposalProduct> createProposalProducts(List<ProposalProductDTO> productDTOs, Proposal proposal) {
        return productDTOs.stream().map(dto -> {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            ProposalProduct proposalProduct = proposalMapper.toEntity(dto);
            proposalProduct.setProposal(proposal);
            proposalProduct.setProduct(product);
            proposalProduct.setTotalPrice(dto.getPrice()*dto.getQuantity());

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
                        contentStream.showText("Total Price: $" + proposal.getTotalPrice());
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
                        contentStream.showText("$" + product.getPrice());
                        contentStream.newLineAtOffset(100, 0);
                        contentStream.showText("$" + product.getTotalPrice());
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
            detailsRow3.createCell(0).setCellValue("Total Price: $" + proposal.getTotalPrice());

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
                row.createCell(2).setCellValue(product.getPrice().doubleValue());
                row.createCell(3).setCellValue(product.getTotalPrice().doubleValue());
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
}
