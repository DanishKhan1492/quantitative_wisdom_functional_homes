package com.qw.qwhomes.domains.product.service;

import com.qw.qwhomes.domains.product.data.entity.ProductStatus;
import com.qw.qwhomes.domains.product.service.dto.ProductDTO;
import com.qw.qwhomes.domains.product.service.dto.ProductDashboardDTO;
import com.qw.qwhomes.domains.product.service.dto.ProductFilterDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductDTO productDTO, List<MultipartFile> images);
    ProductDTO getProductById(Long id);
    ProductDTO getProductBySku(String sku);
    Page<ProductDTO> getAllProducts(Pageable pageable, String search, ProductFilterDto productFilterDto);
    ProductDTO updateProduct(Long id, ProductDTO productDTO, List<MultipartFile> images);
    void deleteProduct(Long id);
    ProductDTO updateProductImages(Long productId, List<MultipartFile> images);
    void updateProductStatus(Long productId, ProductStatus status);
    ProductDashboardDTO getProductsMetadata();
    List<ProductDTO> getAllProductsByFamilyAndSubFamily(Long familyId, Long subFamilyId);
}
