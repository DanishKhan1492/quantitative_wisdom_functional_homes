package com.qw.qwhomes.domains.furniturefamily.data.repository;

import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FurnitureFamilyRepository extends JpaRepository<FurnitureFamily, Long> {
    Optional<FurnitureFamily> findByName(String name);
    List<FurnitureFamily> findByCategoryId(Long categoryId);

    // Methods for FurnitureSubFamily
    List<FurnitureSubFamily> findSubFamiliesByFamilyId(Long familyId);
    Optional<FurnitureSubFamily> findSubFamilyByNameAndFamilyId(String name, Long familyId);
}