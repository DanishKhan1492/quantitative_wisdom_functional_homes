package com.qw.qwhomes.domains.apartmenttype.data.repository;

import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ApartmentTypeRepository extends JpaRepository<ApartmentType, Long>, JpaSpecificationExecutor<ApartmentType> {
}
