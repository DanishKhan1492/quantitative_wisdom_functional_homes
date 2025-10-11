package com.qw.qwhomes.domains.client.service.impl;

import com.qw.qwhomes.domains.client.data.entity.Client;
import com.qw.qwhomes.domains.client.data.repository.ClientRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ClientExportService {

    @Autowired
    private ClientRepository clientRepository;

    private static final String[] HEADERS = {
            "ID", "Name", "Email", "Secondary Email", "Phone", "Secondary Phone", "Address", "Status"
    };

    public ByteArrayInputStream exportToExcel() throws IOException {
        List<Client> clients = clientRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Clients");

            // Header
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < HEADERS.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(HEADERS[col]);
            }

            // Data
            int rowIdx = 1;
            for (Client client : clients) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(client.getClientId());
                row.createCell(1).setCellValue(client.getName());
                row.createCell(2).setCellValue(client.getEmail());
                row.createCell(3).setCellValue(client.getSecondaryEmail());
                row.createCell(4).setCellValue(client.getPhone());
                row.createCell(5).setCellValue(client.getSecondaryPhone());
                row.createCell(6).setCellValue(client.getAddress());
                row.createCell(7).setCellValue(client.isStatus() ? "Active" : "Inactive");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

}