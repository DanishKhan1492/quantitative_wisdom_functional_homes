package com.qw.qwhomes.domains.apartmenttype.data.repository;

import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentTypeRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApartmentTypeRequirementRepository extends JpaRepository<ApartmentTypeRequirement, Long> {
}
