package com.qw.qwhomes.common.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IoService {
    String saveImage(MultipartFile image);
    List<String> saveImages(List<MultipartFile> files, String subDirectory);
    void deleteImage(String imagePath);
    byte[] loadFileAsByteArray(String filePath) throws IOException;
}
