package com.qw.qwhomes.domains.product.service.impl;

import com.qw.qwhomes.common.exceptions.QWIOException;
import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.common.service.IoService;
import com.qw.qwhomes.config.QWContext;
import com.qw.qwhomes.domains.colour.data.entity.Colour;
import com.qw.qwhomes.domains.colour.data.repository.ColourRepository;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import com.qw.qwhomes.domains.furniturefamily.data.repository.FurnitureFamilyRepository;
import com.qw.qwhomes.domains.furniturefamily.data.repository.FurnitureSubFamilyRepository;
import com.qw.qwhomes.domains.material.data.entity.Material;
import com.qw.qwhomes.domains.material.data.repository.MaterialRepository;
import com.qw.qwhomes.domains.product.data.entity.Product;
import com.qw.qwhomes.domains.product.data.entity.ProductStatus;
import com.qw.qwhomes.domains.product.data.repository.ProductRepository;
import com.qw.qwhomes.domains.product.service.dto.ProductDTO;
import com.qw.qwhomes.domains.product.service.dto.ProductDashboardDTO;
import com.qw.qwhomes.domains.product.service.dto.ProductFilterDto;
import com.qw.qwhomes.domains.product.service.mapper.ProductMapper;
import com.qw.qwhomes.domains.product.service.ProductService;
import com.qw.qwhomes.domains.supplier.data.entity.Supplier;
import com.qw.qwhomes.domains.supplier.data.repository.SupplierRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final FurnitureSubFamilyRepository furnitureSubFamilyRepository;
    private final SupplierRepository supplierRepository;
    private final MessageSource messageSource;
    private final IoService ioService;
    private final FurnitureFamilyRepository furnitureFamilyRepository;
    private final ColourRepository colourRepository;
    private final MaterialRepository materialRepository;

    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO, List<MultipartFile> images) {
        Product product = productMapper.toEntity(productDTO);
        setProductRelations(product, productDTO);
        product.setStatus(ProductStatus.Active);

        if (CollectionUtils.isNotEmpty(images)) {
            List<String> imagePaths = ioService.saveImages(images, "products");
            product.setImages(String.join(",", imagePaths));
        }
        product.setCreatedBy(QWContext.get().getUserId());
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("product.notFound", new Object[]{id}, LocaleContextHolder.getLocale())));
        var productDto = productMapper.toResponseDTO(product);
        List<byte[]> images = new ArrayList<>();
        if (product.getImages() != null) {
            for (String imagePath : product.getImages().split(",")) {
                try {
                    byte[] imageData = ioService.loadFileAsByteArray(imagePath);
                    images.add(imageData);
                } catch (IOException e) {
                    throw new QWIOException(e.getMessage(), e);
                }
            }
        }
        productDto.setAllImages(images);
        return productDto;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("product.skuNotFound", new Object[]{sku}, LocaleContextHolder.getLocale())));
        return productMapper.toResponseDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllProducts(Pageable pageable, String search, ProductFilterDto productFilterDto) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by name or SKU
            if (search != null && !search.isEmpty()) {
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("sku")), "%" + search.toLowerCase() + "%")
                ));
            }

            // Join and filter by Family
            if (StringUtils.isNotEmpty(productFilterDto.getFamilyFilter())) {
                Join<Product, FurnitureFamily> familyJoin = root.join("family");
                predicates.add(cb.like(familyJoin.get("name"), "%" + productFilterDto.getFamilyFilter() + "%"));            }

            // Join and filter by Subfamily
            if (StringUtils.isNotEmpty(productFilterDto.getSubFamilyFilter())) {
                Join<Product, FurnitureSubFamily> subfamilyJoin = root.join("subfamily");
                predicates.add(cb.like(subfamilyJoin.get("name"), "%" + productFilterDto.getSubFamilyFilter() + "%"));
            }

            // Filter by price range
            if (productFilterDto.getPriceMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), productFilterDto.getPriceMin()));
            }
            if (productFilterDto.getPriceMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), productFilterDto.getPriceMax()));
            }

            // Join and filter by Material
            if (StringUtils.isNotEmpty(productFilterDto.getMaterialFilter())) {
                Join<Product, Material> materialJoin = root.join("materials");
                predicates.add(cb.like(materialJoin.get("name"), "%" + productFilterDto.getMaterialFilter() + "%"));
            }

            // Join and filter by Colour
            if (StringUtils.isNotEmpty(productFilterDto.getColourFilter())) {
                Join<Product, Colour> colourJoin = root.join("colours");
                predicates.add(cb.like(colourJoin.get("name"), "%" + productFilterDto.getColourFilter() + "%"));
            }

            // Filter by dimensions
            if (productFilterDto.getDimensionHeight() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("height"), productFilterDto.getDimensionHeight()));
            }
            if (productFilterDto.getDimensionWidth() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("width"), productFilterDto.getDimensionWidth()));
            }
            if (productFilterDto.getDimensionLength() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("length"), productFilterDto.getDimensionLength()));
            }

            // Join and filter by Supplier
            if (StringUtils.isNotEmpty(productFilterDto.getSupplierFilter())) {
                Join<Product, Supplier> supplierJoin = root.join("supplier");
                predicates.add(cb.like(supplierJoin.get("name"), "%" + productFilterDto.getSupplierFilter() + "%"));
            }

            return predicates.isEmpty() ? null : cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable).map(productMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO, List<MultipartFile> images) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage(
                        "product.notFound", new Object[]{id}, LocaleContextHolder.getLocale())));
        
        productMapper.updateEntityFromDTO(productDTO, product);
        setProductRelations(product, productDTO);
        
        if (productDTO.getStatus() != null) {
            product.setStatus(productDTO.getStatus());
        }

        if (images != null && !images.isEmpty()) {
            // Delete existing images
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                Arrays.stream(product.getImages().split(","))
                        .forEach(ioService::deleteImage);
            }
            
            // Save new images
            List<String> imagePaths = ioService.saveImages(images, "products");
            product.setImages(String.join(",", imagePaths));
        }
        product.setUpdatedBy(QWContext.get().getUserId());
        Product updatedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("product.notFound", new Object[]{id}, LocaleContextHolder.getLocale())));

        // Delete associated images first
        if (StringUtils.isNotEmpty(product.getImages())) {
            Arrays.stream(product.getImages().split(","))
                .forEach(ioService::deleteImage);
        }

        productRepository.delete(product);
    }

    @Override
    @Transactional
    public ProductDTO updateProductImages(Long productId, List<MultipartFile> images) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        // Delete existing images if any
        if (StringUtils.isNotEmpty(product.getImages())) {
            Arrays.asList(product.getImages().split("::")).forEach(ioService::deleteImage);
        }

        // Save new images
        List<String> imagePaths = ioService.saveImages(images, "products/" + productId);
        product.setImages(String.join(",", imagePaths));
        
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(savedProduct);
    }

    @Transactional
    @Override
    public void updateProductStatus(Long productId, ProductStatus status) {
        var product = productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException(messageSource.getMessage("product.notFound", new Object[]{productId}, LocaleContextHolder.getLocale()))
        );

        product.setStatus(status);
        productRepository.save(product);
    }

    @Transactional(readOnly = true)
    @Override
    public ProductDashboardDTO getProductsMetadata() {
        return productRepository.getProductsMetadata();
    }

    @Override
    public List<ProductDTO> getAllProductsByFamilyAndSubFamily(Long familyId, Long subFamilyId) {
        return productRepository.getProductsByFamilyIdAndSubFamilyId(familyId, subFamilyId)
                .stream().map(productMapper::toResponseDTO).collect(Collectors.toList());
    }

    private void setProductRelations(Product product, ProductDTO productDTO) {
        if (productDTO.getFamilyId() != null) {
            FurnitureFamily family = furnitureFamilyRepository.findById(productDTO.getFamilyId()).orElseThrow(
                    () -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.notFound", new Object[]{productDTO.getFamilyId()}, LocaleContextHolder.getLocale()))
            );
            product.setFamily(family);
        }
        if (productDTO.getSubFamilyId() != null) {
            FurnitureSubFamily subFamily = furnitureSubFamilyRepository.findById(productDTO.getSubFamilyId())
                    .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureSubFamily.notFound", new Object[]{productDTO.getSubFamilyId()}, LocaleContextHolder.getLocale())));
            product.setSubFamily(subFamily);
        }
        if (productDTO.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(productDTO.getSupplierId()).orElseThrow(
                    () -> new ResourceNotFoundException(messageSource.getMessage("supplier.notFound", new Object[]{productDTO.getSupplierId()}, LocaleContextHolder.getLocale()))
            );
            product.setSupplier(supplier);
        }


        if (product.getProductId() == null) {
            if(CollectionUtils.isNotEmpty(productDTO.getColourIds())){
                var colours = colourRepository.findAllById(productDTO.getColourIds());
                product.setColours(colours);
            }

            if(CollectionUtils.isNotEmpty(productDTO.getMaterialIds())){
                var materials = materialRepository.findAllById(productDTO.getMaterialIds());
                product.setMaterials(materials);
            }
        }else {
            if (CollectionUtils.isNotEmpty(productDTO.getColourIds())) {
                var existingColours = product.getColours();
                var newColours = colourRepository.findAllById(productDTO.getColourIds());

                // Add new colours
                for (var colour : newColours) {
                    if (!existingColours.contains(colour)) {
                        existingColours.add(colour);
                    }
                }

                // Remove old colours
                existingColours.removeIf(colour -> !productDTO.getColourIds().contains(colour.getColourId()));
                product.setColours(existingColours);
            }

            if (CollectionUtils.isNotEmpty(productDTO.getMaterialIds())) {
                var existingMaterials = product.getMaterials();
                var newMaterials = materialRepository.findAllById(productDTO.getMaterialIds());

                // Add new materials
                for (var material : newMaterials) {
                    if (!existingMaterials.contains(material)) {
                        existingMaterials.add(material);
                    }
                }

                // Remove old materials
                existingMaterials.removeIf(material -> !productDTO.getMaterialIds().contains(material.getMaterialId()));
                product.setMaterials(existingMaterials);
            }

        }

    }
}
