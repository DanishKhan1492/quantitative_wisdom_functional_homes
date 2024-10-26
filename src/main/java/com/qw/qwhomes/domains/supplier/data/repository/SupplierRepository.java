package com.qw.qwhomes.domains.supplier.data.repository;

import com.qw.qwhomes.domains.supplier.data.entity.Supplier;
import jakarta.persistence.QueryHint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long>, JpaSpecificationExecutor<Supplier> {
    Optional<Supplier> findByNameAndBusinessRegistrationNumber(String name, String businessRegistrationNumber);
}
