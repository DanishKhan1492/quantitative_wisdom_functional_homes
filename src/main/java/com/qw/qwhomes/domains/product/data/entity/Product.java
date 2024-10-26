package com.qw.qwhomes.domains.product.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import com.qw.qwhomes.domains.supplier.data.entity.Supplier;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_id_seq")
    @SequenceGenerator(name = "product_id_seq", sequenceName = "product_id_seq", allocationSize = 1)
    @Column(name = "product_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "sku", nullable = false, unique = true)
    private String sku;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private FurnitureFamily family;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subfamily_id")
    private FurnitureSubFamily subfamily;

    @Column(name = "height")
    private BigDecimal height;

    @Column(name = "length")
    private BigDecimal length;

    @Column(name = "width")
    private BigDecimal width;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "discount")
    private BigDecimal discount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @Column(name = "description")
    private String description;

    @Column(name = "images")
    private String images;

    public enum ProductStatus {
        Active, Inactive
    }
}
