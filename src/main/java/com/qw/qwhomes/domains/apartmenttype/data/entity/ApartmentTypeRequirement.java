package com.qw.qwhomes.domains.apartmenttype.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "apartment_type_requirement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApartmentTypeRequirement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "apartment_type_requirement_id_seq")
    @SequenceGenerator(name = "apartment_type_requirement_id_seq", sequenceName = "apartment_type_requirement_id_seq", allocationSize = 1)
    @Column(name = "requirement_id")
    private Long id;

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
