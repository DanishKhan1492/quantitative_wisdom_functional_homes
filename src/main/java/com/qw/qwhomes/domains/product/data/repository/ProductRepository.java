package com.qw.qwhomes.domains.product.data.repository;

import com.qw.qwhomes.domains.product.data.entity.Product;
import com.qw.qwhomes.domains.product.service.dto.ProductDashboardDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySku(String sku);

    @Query("SELECT new com.qw.qwhomes.domains.product.service.dto.ProductDashboardDTO(COUNT(p)) FROM Product p")
    ProductDashboardDTO getProductsMetadata();

    @Query("SELECT p FROM Product p WHERE p.status = com.qw.qwhomes.domains.product.data.entity.ProductStatus.Active and p.family.familyId = :familyId AND p.subFamily.subFamilyId = :subFamilyId")
    List<Product> getProductsByFamilyIdAndSubFamilyId(Long familyId, Long subFamilyId);
}
