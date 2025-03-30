package com.qw.qwhomes.domains.furniturefamily.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
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
@Table(name = "furniture_subfamily")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FurnitureSubFamily extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "subfamily_id_seq")
    @SequenceGenerator(name = "subfamily_id_seq", sequenceName = "subfamily_id_seq", allocationSize = 1)
    @Column(name = "subfamily_id")
    private Long subFamilyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private FurnitureFamily family;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "type")
    private String type;

    @Column(name = "description")
    private String description;
}
