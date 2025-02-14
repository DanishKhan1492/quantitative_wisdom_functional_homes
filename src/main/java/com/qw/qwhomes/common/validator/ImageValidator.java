package com.qw.qwhomes.common.validator;

import jakarta.validation.ValidationException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Component
public class ImageValidator {
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png");
    private static final long MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB in bytes

    public void validateImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ValidationException("Image file cannot be empty");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new ValidationException("Invalid image format. Only JPEG and PNG are allowed");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ValidationException("Image size exceeds maximum limit of 8MB");
        }
    }

    public void validateImages(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new ValidationException("At least one image must be provided");
        }

        files.forEach(this::validateImage);
    }
} 