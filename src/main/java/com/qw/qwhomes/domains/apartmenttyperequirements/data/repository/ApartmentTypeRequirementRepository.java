package com.qw.qwhomes.domains.apartmenttyperequirements.data.repository;

import com.qw.qwhomes.domains.apartmenttyperequirements.data.entity.ApartmentTypeRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ApartmentTypeRequirementRepository extends JpaRepository<ApartmentTypeRequirement, Long>, JpaSpecificationExecutor<ApartmentTypeRequirement> {
}
