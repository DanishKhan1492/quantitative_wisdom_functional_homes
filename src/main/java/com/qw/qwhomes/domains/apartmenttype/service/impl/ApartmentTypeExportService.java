package com.qw.qwhomes.domains.apartmenttype.service.impl;

import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import com.qw.qwhomes.domains.apartmenttype.data.repository.ApartmentTypeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApartmentTypeExportService {

    private final ApartmentTypeRepository apartmentTypeRepository;

    private static final String[] HEADERS = {
            "ID", "Name", "Category", "Number of Bedrooms", "Description",
            "Floor Area Min", "Floor Area Max"
    };

    public ByteArrayInputStream exportToExcel() throws IOException {
        List<ApartmentType> apartmentTypes = apartmentTypeRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Apartment Types");

            // Header
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < HEADERS.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS[col]);
            }

            // Data
            int rowIdx = 1;
            for (ApartmentType apartmentType : apartmentTypes) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(apartmentType.getApartmentId());
                row.createCell(1).setCellValue(apartmentType.getName());
                row.createCell(2).setCellValue(apartmentType.getCategory() != null ?
                        apartmentType.getCategory().getName() : "");
                row.createCell(3).setCellValue(apartmentType.getNumberOfBedrooms());
                row.createCell(4).setCellValue(apartmentType.getDescription());
                row.createCell(5).setCellValue(apartmentType.getFloorAreaMin() != null ?
                        apartmentType.getFloorAreaMin() : 0.0);
                row.createCell(6).setCellValue(apartmentType.getFloorAreaMax() != null ?
                        apartmentType.getFloorAreaMax() : 0.0);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}