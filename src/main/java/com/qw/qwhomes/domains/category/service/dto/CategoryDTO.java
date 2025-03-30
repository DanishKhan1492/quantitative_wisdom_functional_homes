package com.qw.qwhomes.domains.category.service.dto;

import com.qw.qwhomes.domains.category.data.entity.Category;
import lombok.Data;

@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private Category.CategoryType type;
    private String description;
}
