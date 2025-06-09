package com.qw.qwhomes.domains.client.data.repository;

import com.qw.qwhomes.domains.client.data.entity.Client;
import com.qw.qwhomes.domains.client.service.dto.ClientDTO;
import com.qw.qwhomes.domains.client.service.dto.ClientDashboardDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long>, JpaSpecificationExecutor<Client> {
    boolean existsByEmailIgnoreCase(String email);
    @Query("SELECT new com.qw.qwhomes.domains.client.service.dto.ClientDashboardDTO(COUNT(c)) FROM Client c")
    ClientDashboardDTO getClientsMetaData();

    @Modifying
    @Query("update Client c set c.status = :status where c.clientId = :id")
    void updateClientStatus(@Param("id") Long id, @Param("status") boolean status);

    @Query("select c from Client c where c.status = true")
    List<Client> getAllActiveClients();
}
