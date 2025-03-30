package com.qw.qwhomes.domains.colour.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "colour", indexes = {
    @Index(name = "idx_colour_name", columnList = "name"),
    @Index(name = "idx_colour_code", columnList = "code")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Colour extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "colour_seq")
    @SequenceGenerator(name = "colour_seq", sequenceName = "colour_id_seq", allocationSize = 1)
    @Column(name = "colour_id")
    private Long colourId;

    @Column(nullable = false, length = 50, unique = true)
    private String name;

    @Column(length = 20)
    private String code;

    @Column(columnDefinition = "text")
    private String description;
}
