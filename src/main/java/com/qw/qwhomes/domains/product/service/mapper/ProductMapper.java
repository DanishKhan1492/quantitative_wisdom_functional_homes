package com.qw.qwhomes.domains.product.service.mapper;

import com.qw.qwhomes.domains.product.data.entity.Product;
import com.qw.qwhomes.domains.product.service.dto.ProductDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "productId", ignore = true)
    Product toEntity(ProductDTO dto);

    @Mapping(target = "familyName", source = "family.name")
    @Mapping(target = "subFamilyName", source = "subFamily.name")
    @Mapping(target = "supplierName", source = "supplier.name")
    @Mapping(target = "familyId", source = "family.familyId")
    @Mapping(target = "subFamilyId", source = "subFamily.subFamilyId")
    @Mapping(target = "supplierId", source = "supplier.id")
    ProductDTO toResponseDTO(Product product);

    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "colours", ignore = true)
    @Mapping(target = "materials", ignore = true)
    @Mapping(target = "images", ignore = true)
    void updateEntityFromDTO(ProductDTO dto, @MappingTarget Product product);
}
