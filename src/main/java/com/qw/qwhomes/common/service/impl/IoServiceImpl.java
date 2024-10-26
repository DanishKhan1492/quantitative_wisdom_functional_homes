package com.qw.qwhomes.common.service.impl;

import com.qw.qwhomes.common.exceptions.QWIOException;
import com.qw.qwhomes.common.service.IoService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class IoServiceImpl implements IoService {

    @Value("${application.upload.product-images}")
    private String uploadPath;

    @Override
    public String saveImage(MultipartFile image) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path uploadDir = Paths.get(uploadPath);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(image.getInputStream(), filePath);
            return fileName;
        } catch (IOException e) {
            throw new QWIOException("Failed to save image: " + e.getMessage());
        }
    }
}
