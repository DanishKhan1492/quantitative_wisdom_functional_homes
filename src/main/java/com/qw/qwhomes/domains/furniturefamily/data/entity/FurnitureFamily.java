package com.qw.qwhomes.domains.furniturefamily.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import com.qw.qwhomes.domains.category.data.entity.Category;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "furniture_family")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FurnitureFamily extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "family_id_seq")
    @SequenceGenerator(name = "family_id_seq", sequenceName = "family_id_seq", allocationSize = 1)
    @Column(name = "family_id")
    private Long familyId;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FurnitureSubFamily> subFamilies;
}