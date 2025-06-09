package com.qw.qwhomes.domains.client.service.impl;

import com.qw.qwhomes.common.exceptions.ResourceDuplicateException;
import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.config.QWContext;
import com.qw.qwhomes.domains.client.data.entity.Client;
import com.qw.qwhomes.domains.client.data.repository.ClientRepository;
import com.qw.qwhomes.domains.client.service.ClientService;
import com.qw.qwhomes.domains.client.service.dto.ClientDTO;
import com.qw.qwhomes.domains.client.service.dto.ClientDashboardDTO;
import com.qw.qwhomes.domains.client.service.mapper.ClientMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final MessageSource messageSource;

    @Override
    @Transactional
    public ClientDTO createClient(ClientDTO clientDto) {
        var isClientWithSameEmailAlreadyPresent = clientRepository.existsByEmailIgnoreCase(clientDto.getName());
        if (isClientWithSameEmailAlreadyPresent) {
            throw new ResourceDuplicateException(messageSource.getMessage("client.duplicate", new Object[]{clientDto.getName()}, Locale.getDefault()));
        }

        Client client = clientMapper.toEntity(clientDto);
        client.setCreatedBy(QWContext.get().getUserId());
        return clientMapper.toDto(clientRepository.save(client));
    }

    @Override
    @Transactional(readOnly = true)
    public ClientDTO getClientById(Long id) {
        return clientRepository.findById(id)
                .map(clientMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException(
                        messageSource.getMessage("client.notFound", new Object[]{id}, Locale.getDefault())
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClientDTO> getAllClients(Pageable pageable, String search) {
        Specification<Client> spec = (root, query, cb) -> {
            if (search == null || search.isEmpty()) {
                return null;
            }
            return cb.or(
                    cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("secondaryEmail")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("phone")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("secondaryPhone")), "%" + search.toLowerCase() + "%")
            );
        };
        return clientRepository.findAll(spec, pageable).map(clientMapper::toDto);
    }

    @Override
    @Transactional
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        messageSource.getMessage("client.notFound", new Object[]{id}, Locale.getDefault())
                ));
        if (!clientDTO.getName().equals(client.getName())) {
            var isClientByEmailAlreadyPresent = clientRepository.existsByEmailIgnoreCase(clientDTO.getName());
            if (isClientByEmailAlreadyPresent) {
                throw new ResourceDuplicateException(messageSource.getMessage("client.duplicate", new Object[]{clientDTO.getName()}, Locale.getDefault()));
            }
        }
        clientMapper.updateEntityFromDto(clientDTO, client);
        client.setUpdatedBy(QWContext.get().getUserId());
        return clientMapper.toDto(clientRepository.save(client));
    }

    @Override
    @Transactional
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    messageSource.getMessage("client.notFound", new Object[]{id}, Locale.getDefault())
            );
        }
        clientRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public ClientDashboardDTO getClientsMetaData() {
        return clientRepository.getClientsMetaData();
    }

    @Transactional
    @Override
    public void updateClientStatus(Long id, boolean status) {
        clientRepository.updateClientStatus(id, status);
    }

    @Override
    public List<ClientDTO> getAllActiveClients() {
        return clientRepository.getAllActiveClients().stream().map(clientMapper::toDto).toList();
    }
}
