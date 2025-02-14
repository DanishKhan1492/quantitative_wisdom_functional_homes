package com.qw.qwhomes.domains.furniturefamily.data.repository;

import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FurnitureSubFamilyRepository extends JpaRepository<FurnitureSubFamily, Long> {
    @Query("select fsf from FurnitureSubFamily fsf where fsf.family.familyId = :familyId")
    List<FurnitureSubFamily> findByFamilyId(@Param("familyId") Long familyId);
    boolean existsFurnitureSubFamilyByNameIgnoreCase(String name);

    @Query("select count(fsf) from FurnitureSubFamily fsf")
    Long getFurnitureSubFamiliesMetaData();
}
