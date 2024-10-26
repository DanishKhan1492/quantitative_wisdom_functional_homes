package com.qw.qwhomes.domains.product.controller;

import com.qw.qwhomes.domains.product.dto.ProductCreateDTO;
import com.qw.qwhomes.domains.product.dto.ProductResponseDTO;
import com.qw.qwhomes.domains.product.dto.ProductUpdateDTO;
import com.qw.qwhomes.domains.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product Management", description = "APIs for managing products")
public class ProductController {

    private final ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new product")
    public ResponseEntity<ProductResponseDTO> createProduct(
            @Valid @RequestPart("product") ProductCreateDTO productCreateDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        ProductResponseDTO createdProduct = productService.createProduct(productCreateDTO, image);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a product by ID")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        ProductResponseDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/sku/{sku}")
    @Operation(summary = "Get a product by SKU")
    public ResponseEntity<ProductResponseDTO> getProductBySku(@PathVariable String sku) {
        ProductResponseDTO product = productService.getProductBySku(sku);
        return ResponseEntity.ok(product);
    }

    @GetMapping
    @Operation(summary = "Get all products with pagination and search")
    public ResponseEntity<Page<ProductResponseDTO>> getAllProducts(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<ProductResponseDTO> products = productService.getAllProducts(pageable, search);
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a product")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateDTO productUpdateDTO) {
        ProductResponseDTO updatedProduct = productService.updateProduct(id, productUpdateDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a product")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
