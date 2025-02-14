package com.qw.qwhomes.domains.supplier.data.repository;

import com.qw.qwhomes.domains.supplier.data.entity.Supplier;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierDashboardDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long>, JpaSpecificationExecutor<Supplier> {
    Optional<Supplier> findByNameAndBusinessRegistrationNumber(String name, String businessRegistrationNumber);

    @Query("""
        select new com.qw.qwhomes.domains.supplier.service.dto.SupplierDashboardDTO(
       count(sp),
       sum(case when sp.status = true then 1 else 0 end),
       sum(case when sp.status = false then 1 else 0 end))
       from Supplier sp
    """)
    SupplierDashboardDTO getSuppliersMetaData();
}
