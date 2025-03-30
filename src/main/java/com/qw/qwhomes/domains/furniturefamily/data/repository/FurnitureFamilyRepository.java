package com.qw.qwhomes.domains.furniturefamily.data.repository;

import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureFamily;
import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FurnitureFamilyRepository extends JpaRepository<FurnitureFamily, Long> {
    Optional<FurnitureFamily> findByName(String name);
    List<FurnitureFamily> findByCategoryId(Long categoryId);
    boolean existsFurnitureFamilyByNameIgnoreCase(String name);

    @Query("SELECT COUNT(f) FROM FurnitureFamily f")
    Long getFurnitureFamiliesMetaData();
}
