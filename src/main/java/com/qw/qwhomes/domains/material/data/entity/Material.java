package com.qw.qwhomes.domains.material.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_id")
    private Long materialId;

    @Column(name = "name", nullable = false, length = 50, unique = true)
    private String name;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "description")
    private String description;
}
