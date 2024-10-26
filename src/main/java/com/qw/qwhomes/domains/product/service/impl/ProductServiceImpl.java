package com.qw.qwhomes.domains.product.service.impl;

import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.common.service.IoService;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import com.qw.qwhomes.domains.furniturefamily.data.repository.FurnitureFamilyRepository;
import com.qw.qwhomes.domains.furniturefamily.data.repository.FurnitureSubFamilyRepository;
import com.qw.qwhomes.domains.product.data.entity.Product;
import com.qw.qwhomes.domains.product.data.repository.ProductRepository;
import com.qw.qwhomes.domains.product.dto.ProductCreateDTO;
import com.qw.qwhomes.domains.product.dto.ProductResponseDTO;
import com.qw.qwhomes.domains.product.dto.ProductUpdateDTO;
import com.qw.qwhomes.domains.product.mapper.ProductMapper;
import com.qw.qwhomes.domains.product.service.ProductService;
import com.qw.qwhomes.domains.supplier.data.entity.Supplier;
import com.qw.qwhomes.domains.supplier.data.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

    @Override
    @Transactional
    public ProductResponseDTO createProduct(ProductCreateDTO productCreateDTO, MultipartFile image) {
        Product product = productMapper.toEntity(productCreateDTO);
        setProductRelations(product, productCreateDTO.getFamilyId(), productCreateDTO.getSubFamilyId(), productCreateDTO.getSupplierId());
        product.setStatus(Product.ProductStatus.Active);

        if (image != null && !image.isEmpty()) {
            String imagePath = ioService.saveImage(image);
            product.setImages(imagePath);
        }

        Product savedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("product.notFound", new Object[]{id}, LocaleContextHolder.getLocale())));
        return productMapper.toResponseDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("product.skuNotFound", new Object[]{sku}, LocaleContextHolder.getLocale())));
        return productMapper.toResponseDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable, String search) {
        Specification<Product> spec = (root, query, cb) -> {
            if (search != null && !search.isEmpty()) {
                return cb.or(
                        cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("sku")), "%" + search.toLowerCase() + "%")
                );
            }
            return null;
        };
        return productRepository.findAll(spec, pageable).map(productMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public ProductResponseDTO updateProduct(Long id, ProductUpdateDTO productUpdateDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("product.notFound", new Object[]{id}, LocaleContextHolder.getLocale())));
        productMapper.updateEntityFromDTO(productUpdateDTO, product);
        setProductRelations(product, productUpdateDTO.getFamilyId(), productUpdateDTO.getSubFamilyId(), productUpdateDTO.getSupplierId());
        if (productUpdateDTO.getStatus() != null) {
            product.setStatus(Product.ProductStatus.valueOf(productUpdateDTO.getStatus()));
        }
        Product updatedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("product.notFound", new Object[]{id}, LocaleContextHolder.getLocale())));
        productRepository.delete(product);
    }

    private void setProductRelations(Product product, Long familyId, Long subFamilyId, Long supplierId) {
        if (familyId != null) {
            FurnitureFamily family = furnitureFamilyRepository.findById(familyId).orElseThrow(
                    () -> new ResourceNotFoundException(messageSource.getMessage("furnitureFamily.notFound", new Object[]{familyId}, LocaleContextHolder.getLocale()))
            );
            product.setFamily(family);
        }
        if (subFamilyId != null) {
            FurnitureSubFamily subFamily = furnitureSubFamilyRepository.findById(subFamilyId)
                    .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("furnitureSubFamily.notFound", new Object[]{subFamilyId}, LocaleContextHolder.getLocale())));
            product.setSubfamily(subFamily);
        }
        if (supplierId != null) {
            Supplier supplier = supplierRepository.findById(supplierId).orElseThrow(
                    () -> new ResourceNotFoundException(messageSource.getMessage("supplier.notFound", new Object[]{supplierId}, LocaleContextHolder.getLocale()))
            );
            product.setSupplier(supplier);
        }
    }
}
