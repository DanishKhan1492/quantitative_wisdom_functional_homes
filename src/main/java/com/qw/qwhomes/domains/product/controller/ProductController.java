package com.qw.qwhomes.domains.product.controller;

import com.qw.qwhomes.domains.colour.service.dto.ColourDashboardDTO;
import com.qw.qwhomes.domains.product.data.entity.ProductStatus;
import com.qw.qwhomes.domains.product.service.dto.ProductDTO;
import com.qw.qwhomes.domains.product.service.dto.ProductDashboardDTO;
import com.qw.qwhomes.domains.product.service.dto.ProductFilterDto;
import com.qw.qwhomes.domains.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product Management", description = "APIs for managing products")
public class ProductController {

    private final ProductService productService;

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create a new product")
    public ResponseEntity<ProductDTO> createProduct(
            @Valid @RequestPart("product") ProductDTO productDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        ProductDTO createdProduct = productService.createProduct(productDTO, images);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    @Operation(summary = "Get a product by ID")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/sku/{sku}")
    @Operation(summary = "Get a product by SKU")
    public ResponseEntity<ProductDTO> getProductBySku(@PathVariable String sku) {
        ProductDTO product = productService.getProductBySku(sku);
        return ResponseEntity.ok(product);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    @Operation(summary = "Get all products with pagination and search")
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            Pageable pageable,
            @RequestParam(required = false) String search, @ModelAttribute ProductFilterDto productFilterDto) {
        Page<ProductDTO> products = productService.getAllProducts(pageable, search, productFilterDto);
        return ResponseEntity.ok(products);
    }


    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update a product",
            description = "Update an existing product with optional new images")
    @ApiResponse(responseCode = "200", description = "Product updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input or image format")
    @ApiResponse(responseCode = "404", description = "Product not found")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestPart("product") ProductDTO productDTO,
            @Parameter(description = "Image files (JPEG/PNG, max 8MB each)")
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO, images);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a product")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update product images",
            description = "Upload new images for a product. Replaces all existing images.")
    @ApiResponse(responseCode = "200", description = "Images updated successfully",
            content = @Content(schema = @Schema(implementation = ProductDTO.class)))
    @ApiResponse(responseCode = "400", description = "Invalid image format or size")
    @ApiResponse(responseCode = "404", description = "Product not found")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<ProductDTO> updateProductImages(
            @PathVariable Long id,
            @Parameter(description = "Image files (JPEG/PNG, max 8MB each)")
            @RequestParam("images") List<MultipartFile> images) {
        return ResponseEntity.ok(productService.updateProductImages(id, images));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PatchMapping("/{id}")
    @Operation(summary = "Update product status",
            description = "Update the status of a product")
    public ResponseEntity<Void> updateProductStatus(@PathVariable("id") Long productId, @RequestParam("status")ProductStatus status) {
        productService.updateProductStatus(productId, status);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/metadata")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get Products Metadata")
    public ResponseEntity<ProductDashboardDTO> getProductsMetadata() {
        return ResponseEntity.ok(productService.getProductsMetadata());
    }
}
