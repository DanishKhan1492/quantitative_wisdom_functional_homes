package com.qw.qwhomes.domains.category.service;

import com.qw.qwhomes.domains.category.data.entity.Category;
import com.qw.qwhomes.domains.category.service.dto.CategoryCreateDTO;
import com.qw.qwhomes.domains.category.service.dto.CategoryDTO;
import com.qw.qwhomes.domains.category.service.dto.CategoryUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {
    CategoryDTO createCategory(CategoryCreateDTO createDTO);
    CategoryDTO updateCategory(CategoryUpdateDTO updateDTO);
    CategoryDTO getCategoryById(Long id);
    Page<CategoryDTO> getAllCategories(String search, Pageable pageable);
    void deleteCategory(Long id);
    List<CategoryDTO> getCategoriesByType(Category.CategoryType type);
}
