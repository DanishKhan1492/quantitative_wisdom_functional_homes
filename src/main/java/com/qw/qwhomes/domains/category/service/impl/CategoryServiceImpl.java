package com.qw.qwhomes.domains.category.service.impl;

import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.config.QWContext;
import com.qw.qwhomes.domains.category.data.entity.Category;
import com.qw.qwhomes.domains.category.data.repository.CategoryRepository;
import com.qw.qwhomes.domains.category.service.CategoryService;
import com.qw.qwhomes.domains.category.service.dto.CategoryCreateDTO;
import com.qw.qwhomes.domains.category.service.dto.CategoryDTO;
import com.qw.qwhomes.domains.category.service.dto.CategoryUpdateDTO;
import com.qw.qwhomes.domains.category.service.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final MessageSource messageSource;

    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryCreateDTO createDTO) {
        Category category = categoryMapper.toEntity(createDTO);
        category.setCreatedBy(QWContext.get().getUserId());
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toDTO(savedCategory);
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(CategoryUpdateDTO updateDTO) {
        Category existingCategory = categoryRepository.findById(updateDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("category.not.found", new Object[]{updateDTO.getId()}, LocaleContextHolder.getLocale())));

        categoryMapper.updateEntityFromDTO(updateDTO, existingCategory);
        existingCategory.setUpdatedBy(QWContext.get().getUserId());
        Category updatedCategory = categoryRepository.save(existingCategory);
        return categoryMapper.toDTO(updatedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(messageSource.getMessage("category.not.found", new Object[]{id}, LocaleContextHolder.getLocale())));
        return categoryMapper.toDTO(category);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryDTO> getAllCategories(String search, Pageable pageable) {
        Page<Category> categories;
        if (StringUtils.isEmpty(search)) {
            categories = categoryRepository.findAll(pageable);
        }else {
            categories = categoryRepository.findAllByNameContainingIgnoreCase(search, pageable);
        }
        return categories.map(categoryMapper::toDTO);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException(messageSource.getMessage("category.not.found", new Object[]{id}, LocaleContextHolder.getLocale()));
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public List<CategoryDTO> getCategoriesByType(Category.CategoryType type) {
        return categoryRepository.getCategoriesByType(type).stream().map(categoryMapper::toDTO).toList();
    }
}
