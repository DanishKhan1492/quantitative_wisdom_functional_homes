package com.qw.qwhomes.domains.apartmenttypesetup.data.repository;

import com.qw.qwhomes.domains.apartmenttypesetup.data.entity.ApartmentTypeRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApartmentTypeRequirementRepository extends JpaRepository<ApartmentTypeRequirement, Long>, JpaSpecificationExecutor<ApartmentTypeRequirement> {

    @Query("select f.familyId as familyId, f.name as familyName, sf.subFamilyId as subFamilyId, sf.name as subFamilyName from ApartmentTypeRequirement p join p.family f join p.subFamily sf  where p.apartmentType.apartmentId = :apartmentTypeId")
    List<ApartmentTypeFamiliesAndSubFamiliesProjection> findFamiliesAndSubFamiliesByApartmentTypeId(@Param("apartmentTypeId") Long id);

}
