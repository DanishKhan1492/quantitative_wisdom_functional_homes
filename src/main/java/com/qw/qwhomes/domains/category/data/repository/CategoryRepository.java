package com.qw.qwhomes.domains.category.data.repository;

import com.qw.qwhomes.domains.category.data.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findAllByNameContainingIgnoreCase(String search, Pageable pageable);
    List<Category> getCategoriesByType(Category.CategoryType type);
}
