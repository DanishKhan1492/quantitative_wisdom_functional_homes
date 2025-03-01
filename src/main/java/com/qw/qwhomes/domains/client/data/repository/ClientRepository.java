package com.qw.qwhomes.domains.client.data.repository;

import com.qw.qwhomes.domains.client.data.entity.Client;
import com.qw.qwhomes.domains.client.service.dto.ClientDashboardDTO;
import com.qw.qwhomes.domains.colour.service.dto.ColourDashboardDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long>, JpaSpecificationExecutor<Client> {
    boolean existsByEmailIgnoreCase(String email);
    @Query("SELECT new com.qw.qwhomes.domains.client.service.dto.ClientDashboardDTO(COUNT(c)) FROM Client c")
    ClientDashboardDTO getClientsMetaData();
}
