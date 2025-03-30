package com.qw.qwhomes.domains.colour.data.repository;

import com.qw.qwhomes.domains.colour.data.entity.Colour;
import com.qw.qwhomes.domains.colour.service.dto.ColourDashboardDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ColourRepository extends JpaRepository<Colour, Long>, JpaSpecificationExecutor<Colour> {
    Optional<Colour> findByNameIgnoreCase(String name);
    Optional<Colour> findByCodeIgnoreCase(String code);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByCodeIgnoreCase(String code);

    @Query("SELECT new com.qw.qwhomes.domains.colour.service.dto.ColourDashboardDTO(COUNT(c)) FROM Colour c")
    ColourDashboardDTO getColoursMetaData();
}
