package com.qw.qwhomes.domains.apartmenttype.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import com.qw.qwhomes.domains.category.data.entity.Category;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "apartment_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentType extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "apartment_type_id_seq")
    @SequenceGenerator(name = "apartment_type_id_seq", sequenceName = "apartment_type_id_seq", allocationSize = 1)
    @Column(name = "apartment_type_id")
    private Long apartmentId;

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
    private Double floorAreaMin;

    @Column(name = "floor_area_max")
    private Double floorAreaMax;
}
