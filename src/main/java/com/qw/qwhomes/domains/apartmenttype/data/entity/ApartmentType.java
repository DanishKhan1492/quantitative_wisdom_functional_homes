package com.qw.qwhomes.domains.apartmenttype.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import com.qw.qwhomes.domains.category.data.entity.Category;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "apartment_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApartmentType extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "apartment_type_id_seq")
    @SequenceGenerator(name = "apartment_type_id_seq", sequenceName = "apartment_type_id_seq", allocationSize = 1)
    @Column(name = "apartment_type_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "number_of_bedrooms", nullable = false)
    private Integer numberOfBedrooms;

    @Column(name = "description")
    private String description;

    @Column(name = "floor_area_min")
    private BigDecimal floorAreaMin;

    @Column(name = "floor_area_max")
    private BigDecimal floorAreaMax;

    @OneToMany(mappedBy = "apartmentType", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ApartmentTypeRequirement> requirements;
}
