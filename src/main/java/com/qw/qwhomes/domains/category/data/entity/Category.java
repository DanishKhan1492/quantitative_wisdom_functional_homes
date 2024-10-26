package com.qw.qwhomes.domains.category.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "category_id_seq")
    @SequenceGenerator(name = "category_id_seq", sequenceName = "category_id_seq", allocationSize = 1)
    @Column(name = "category_id")
    private Long id;

    @Column(name = "category_name", nullable = false, unique = true)
    private String name;

    @Column(name = "category_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private CategoryType type;

    @Column(name = "description")
    private String description;

    public enum CategoryType {
        Apartment, Furniture, Product, Other
    }
}
