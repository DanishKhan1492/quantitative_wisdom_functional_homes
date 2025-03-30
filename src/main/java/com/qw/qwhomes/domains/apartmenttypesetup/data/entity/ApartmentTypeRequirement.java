package com.qw.qwhomes.domains.apartmenttypesetup.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
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
@Table(name = "apartment_type_requirement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentTypeRequirement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "apartment_type_requirement_id_seq")
    @SequenceGenerator(name = "apartment_type_requirement_id_seq", sequenceName = "apartment_type_requirement_id_seq", allocationSize = 1)
    @Column(name = "requirement_id")
    private Long apartmentTypeRequirementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_type_id")
    private ApartmentType apartmentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private FurnitureFamily family;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subfamily_id")
    private FurnitureSubFamily subFamily;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;
}
