package com.qw.qwhomes.domains.product.mapper;

import com.qw.qwhomes.domains.product.data.entity.Product;
import com.qw.qwhomes.domains.product.dto.ProductCreateDTO;
import com.qw.qwhomes.domains.product.dto.ProductResponseDTO;
import com.qw.qwhomes.domains.product.dto.ProductUpdateDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    Product toEntity(ProductCreateDTO dto);

    ProductResponseDTO toResponseDTO(Product product);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(ProductUpdateDTO dto, @MappingTarget Product product);
}
