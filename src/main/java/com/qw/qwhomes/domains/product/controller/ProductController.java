package com.qw.qwhomes.domains.product.controller;

import com.qw.qwhomes.domains.colour.data.entity.Colour;
import com.qw.qwhomes.domains.material.data.entity.Material;
import com.qw.qwhomes.domains.product.data.entity.Product;
import com.qw.qwhomes.domains.product.data.entity.ProductStatus;
import com.qw.qwhomes.domains.product.service.ProductService;
import com.qw.qwhomes.domains.product.service.dto.ProductDTO;
import com.qw.qwhomes.domains.product.service.dto.ProductDashboardDTO;
import com.qw.qwhomes.domains.product.service.dto.ProductFilterDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.qw.qwhomes.common.service.impl.ExcelExportService;
import com.qw.qwhomes.domains.product.data.repository.ProductRepository;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Product Management", description = "APIs for managing products")
public class ProductController {

    private final ProductService productService;
    private final ExcelExportService excelExportService;
    private final ProductRepository productRepository;

    private static final String[] PRODUCT_HEADERS = {
            "ID", "Name", "SKU", "Price", "Discount", "Status", "Height", "Length", "Width",
            "Supplier", "Family", "Sub Family", "Colours", "Materials",
    };



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

    @GetMapping("/family/{familyId}/subfamily/{subFamilyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all products by family and subfamily")
    public ResponseEntity<List<ProductDTO>> getAllProductsByFamilyAndSubFamily(@PathVariable("familyId") Long familyId, @PathVariable("subFamilyId") Long subFamilyId) {
        return ResponseEntity.ok(productService.getAllProductsByFamilyAndSubFamily(familyId, subFamilyId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/export/excel")
    @Operation(summary = "Export products to Excel")
    public ResponseEntity<InputStreamResource> exportToExcel() throws IOException {
        List<Product> products = productRepository.findAll();

        ByteArrayInputStream in = excelExportService.exportToExcel(
                products,
                PRODUCT_HEADERS,
                "Products",
                product -> new Object[]{
                        product.getProductId(),
                        product.getName(),
                        product.getSku(),
                        product.getPrice(),
                        product.getDiscount() != null ? product.getDiscount() : 0,
                        product.getStatus() != null ? product.getStatus().name() : "N/A",
                        product.getHeight(),
                        product.getLength(),
                        product.getWidth(),
                        product.getSupplier() != null ? product.getSupplier().getName() : "N/A",
                        product.getFamily() != null ? product.getFamily().getName() : "N/A",
                        product.getSubFamily() != null ? product.getSubFamily().getName() : "N/A",
                        product.getColours() != null && !product.getColours().isEmpty()
                                ? product.getColours().stream()
                                .map(Colour::getName)
                                .collect(Collectors.joining(", "))
                                : "N/A",
                        product.getMaterials() != null && !product.getMaterials().isEmpty()
                                ? product.getMaterials().stream()
                                .map(Material::getName)
                                .collect(Collectors.joining(", "))
                                : "N/A",
                }
        );

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=products.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}
