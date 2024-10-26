package com.qw.qwhomes.domains.supplier.data.entity;

import com.qw.qwhomes.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "supplier", indexes = {
    @Index(name = "idx_supplier_name", columnList = "name"),
    @Index(name = "idx_supplier_business_registration_number", columnList = "business_registration_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Supplier extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "supplier_seq")
    @SequenceGenerator(name = "supplier_seq", sequenceName = "supplier_id_seq", allocationSize = 1)
    @Column(name = "supplier_id")
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String name;

    @Size(max = 50)
    @Column(name = "business_registration_number")
    private String businessRegistrationNumber;

    @Size(max = 100)
    @Column(name = "primary_contact_name")
    private String primaryContactName;

    @Size(max = 100)
    @Column(name = "primary_contact_position")
    private String primaryContactPosition;

    @NotBlank
    @Size(max = 20)
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @NotBlank
    @Email
    @Size(max = 100)
    @Column(nullable = false)
    private String email;

    @Size(max = 20)
    @Column(name = "secondary_contact_number")
    private String secondaryContactNumber;

    @Size(max = 255)
    @Column(name = "website_url")
    private String websiteUrl;

    @Size(max = 255)
    @Column(name = "street_address_1")
    private String streetAddress1;

    @Size(max = 255)
    @Column(name = "street_address_2")
    private String streetAddress2;

    @Size(max = 100)
    private String city;

    @Size(max = 100)
    @Column(name = "state_province")
    private String stateProvince;

    @Size(max = 100)
    private String country;

    @Size(max = 100)
    @Column(name = "payment_terms")
    private String paymentTerms;

    @Column(name = "assembly_services")
    private Boolean assemblyServices;

    @Min(0)
    @Column(name = "delivery_time_weeks")
    private Integer deliveryTimeWeeks;

    @Column(name = "tax_number")
    private String taxNumber;

    @Column(name = "supplier_discount")
    private Integer supplierDiscount;

    private boolean status;
}
