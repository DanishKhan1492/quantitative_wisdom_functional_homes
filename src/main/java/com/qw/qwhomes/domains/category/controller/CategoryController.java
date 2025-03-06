package com.qw.qwhomes.domains.category.controller;

import com.qw.qwhomes.domains.category.data.entity.Category;
import com.qw.qwhomes.domains.category.service.CategoryService;
import com.qw.qwhomes.domains.category.service.dto.CategoryCreateDTO;
import com.qw.qwhomes.domains.category.service.dto.CategoryDTO;
import com.qw.qwhomes.domains.category.service.dto.CategoryUpdateDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@Tag(name = "Category Management", description = "APIs for managing categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new category")
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryCreateDTO createDTO) {
        CategoryDTO createdCategory = categoryService.createCategory(createDTO);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing category")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryUpdateDTO updateDTO) {
        updateDTO.setId(id);
        CategoryDTO updatedCategory = categoryService.updateCategory(updateDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a category by ID")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    @GetMapping
    @Operation(summary = "Get all categories with pagination")
    public ResponseEntity<Page<CategoryDTO>> getAllCategories(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<CategoryDTO> categories = categoryService.getAllCategories(search, pageable);
        return ResponseEntity.ok(categories);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a category")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/types")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all categories types")
    public ResponseEntity<List<Category.CategoryType>> getAllCategoryTypes() {
        return ResponseEntity.ok(List.of(Category.CategoryType.values()));
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all categories by type")
    public ResponseEntity<List<CategoryDTO>> getAllCategoriesByType(@PathVariable("type") Category.CategoryType type) {
        return ResponseEntity.ok(categoryService.getCategoriesByType(type));
    }
}
