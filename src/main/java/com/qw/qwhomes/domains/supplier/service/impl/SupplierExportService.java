package com.qw.qwhomes.domains.supplier.service.impl;

import com.qw.qwhomes.domains.supplier.data.entity.Supplier;
import com.qw.qwhomes.domains.supplier.data.repository.SupplierRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;

@Service
public class SupplierExportService {

    @Autowired
    private SupplierRepository supplierRepository;

    private static final String[] HEADERS = {
        "ID", "Name", "Business Registration Number", "Primary Contact Name", "Phone Number", "Email"
    };

    public ByteArrayInputStream exportToExcel() throws IOException {
        List<Supplier> suppliers = supplierRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Suppliers");

            // Header
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < HEADERS.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS[col]);
            }

            // Data
            int rowIdx = 1;
            for (Supplier supplier : suppliers) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(supplier.getId());
                row.createCell(1).setCellValue(supplier.getName());
                row.createCell(2).setCellValue(supplier.getBusinessRegistrationNumber());
                row.createCell(3).setCellValue(supplier.getPrimaryContactName());
                row.createCell(4).setCellValue(supplier.getPhoneNumber());
                row.createCell(5).setCellValue(supplier.getEmail());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream exportToCsv() throws IOException {
        List<Supplier> suppliers = supplierRepository.findAll();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), CSVFormat.DEFAULT.withHeader(HEADERS))) {

            for (Supplier supplier : suppliers) {
                csvPrinter.printRecord(Arrays.asList(
                    supplier.getId(),
                    supplier.getName(),
                    supplier.getBusinessRegistrationNumber(),
                    supplier.getPrimaryContactName(),
                    supplier.getPhoneNumber(),
                    supplier.getEmail()
                ));
            }

            csvPrinter.flush();
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
