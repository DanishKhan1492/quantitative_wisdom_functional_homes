package com.qw.qwhomes.domains.category.service.dto;

import com.qw.qwhomes.domains.category.data.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryCreateDTO {
    @NotBlank(message = "{category.name.not.blank}")
    @Size(max = 100, message = "{category.name.size}")
    private String name;

    @NotNull(message = "{category.type.not.null}")
    private Category.CategoryType type;

    private String description;
}
