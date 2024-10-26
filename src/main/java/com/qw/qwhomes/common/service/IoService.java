package com.qw.qwhomes.common.service;

import org.springframework.web.multipart.MultipartFile;

public interface IoService {
    String saveImage(MultipartFile image);
}
