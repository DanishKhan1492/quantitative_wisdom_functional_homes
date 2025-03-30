package com.qw.qwhomes.domains.category.service.mapper;

import com.qw.qwhomes.domains.category.data.entity.Category;
import com.qw.qwhomes.domains.category.service.dto.CategoryCreateDTO;
import com.qw.qwhomes.domains.category.service.dto.CategoryDTO;
import com.qw.qwhomes.domains.category.service.dto.CategoryUpdateDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {
    CategoryDTO toDTO(Category category);
    Category toEntity(CategoryCreateDTO createDTO);
    void updateEntityFromDTO(CategoryUpdateDTO updateDTO, @MappingTarget Category category);
}
