package com.qw.qwhomes.domains.client.service;

import com.qw.qwhomes.domains.client.service.dto.ClientDTO;
import com.qw.qwhomes.domains.client.service.dto.ClientDashboardDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClientService {
    ClientDTO createClient(ClientDTO clientDTO);
    ClientDTO getClientById(Long id);
    Page<ClientDTO> getAllClients(Pageable pageable, String search);
    ClientDTO updateClient(Long id, ClientDTO clientDTO);
    void deleteClient(Long id);
    ClientDashboardDTO getClientsMetaData();
    void updateClientStatus(Long id, boolean status);
}
