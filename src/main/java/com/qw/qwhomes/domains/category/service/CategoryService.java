package com.qw.qwhomes.domains.category.service;

import com.qw.qwhomes.domains.category.dto.CategoryCreateDTO;
import com.qw.qwhomes.domains.category.dto.CategoryDTO;
import com.qw.qwhomes.domains.category.dto.CategoryUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    CategoryDTO createCategory(CategoryCreateDTO createDTO);
    CategoryDTO updateCategory(CategoryUpdateDTO updateDTO);
    CategoryDTO getCategoryById(Long id);
    Page<CategoryDTO> getAllCategories(String search, Pageable pageable);
    void deleteCategory(Long id);
}
