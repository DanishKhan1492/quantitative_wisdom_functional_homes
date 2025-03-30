package com.qw.qwhomes.common.service.impl;

import com.qw.qwhomes.common.exceptions.FileStorageException;
import com.qw.qwhomes.common.exceptions.QWIOException;
import com.qw.qwhomes.common.service.IoService;
import com.qw.qwhomes.common.validator.ImageValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class IoServiceImpl implements IoService {

    private final ImageValidator imageValidator;

    @Value("${application.upload.upload-path}")
    private String uploadPath;

    @Override
    public String saveImage(MultipartFile image) {
        try {
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
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

    @Override
    public List<String> saveImages(List<MultipartFile> files, String subDirectory) {
        imageValidator.validateImages(files);

        List<String> savedPaths = new ArrayList<>();

        try {
            Path imageUploadPath = Paths.get(uploadPath, subDirectory);
            if (!Files.exists(imageUploadPath)) {
                Files.createDirectories(imageUploadPath);
            }

            for (MultipartFile file : files) {
                String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(Objects.requireNonNull(Objects.requireNonNull(file.getOriginalFilename()).replaceAll(" ", "")));
                Path filePath = imageUploadPath.resolve(fileName);

                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                savedPaths.add(subDirectory + "/" + fileName);
            }

            return savedPaths;
        } catch (IOException ex) {
            throw new FileStorageException("Could not save image files", ex);
        }
    }

    @Override
    public void deleteImage(String imagePath) {
        try {
            Path fullPath = Paths.get(uploadPath, imagePath);
            Files.deleteIfExists(fullPath);
        } catch (IOException ex) {
            throw new FileStorageException("Could not delete image file: " + imagePath, ex);
        }
    }

    public byte[] loadFileAsByteArray(String filePath) throws IOException {
        Path path = Paths.get(uploadPath, filePath);
        return Files.readAllBytes(path);
    }
}
