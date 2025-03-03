package com.qw.qwhomes.domains.apartmenttype.data.repository;

import com.qw.qwhomes.domains.apartmenttype.data.entity.ApartmentType;
import com.qw.qwhomes.domains.apartmenttype.service.dto.ApartmentTypeDashboardDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ApartmentTypeRepository extends JpaRepository<ApartmentType, Long>, JpaSpecificationExecutor<ApartmentType> {

    @Query("SELECT new com.qw.qwhomes.domains.apartmenttype.service.dto.ApartmentTypeDashboardDTO(COUNT(a)) FROM ApartmentType a")
    ApartmentTypeDashboardDTO getApartmentTypeMetadata();
}
