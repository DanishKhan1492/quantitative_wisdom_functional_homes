package com.qw.qwhomes.domains.product.service;

import com.qw.qwhomes.domains.product.dto.ProductCreateDTO;
import com.qw.qwhomes.domains.product.dto.ProductResponseDTO;
import com.qw.qwhomes.domains.product.dto.ProductUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {
    ProductResponseDTO createProduct(ProductCreateDTO productCreateDTO, MultipartFile image);
    ProductResponseDTO getProductById(Long id);
    ProductResponseDTO getProductBySku(String sku);
    Page<ProductResponseDTO> getAllProducts(Pageable pageable, String search);
    ProductResponseDTO updateProduct(Long id, ProductUpdateDTO productUpdateDTO);
    void deleteProduct(Long id);
}
