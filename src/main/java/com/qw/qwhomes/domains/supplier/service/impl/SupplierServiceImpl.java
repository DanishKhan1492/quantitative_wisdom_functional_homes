package com.qw.qwhomes.domains.supplier.service.impl;

import com.qw.qwhomes.common.exceptions.ResourceDuplicateException;
import com.qw.qwhomes.common.exceptions.ResourceNotFoundException;
import com.qw.qwhomes.config.QWContext;
import com.qw.qwhomes.domains.supplier.data.entity.Supplier;
import com.qw.qwhomes.domains.supplier.data.repository.SupplierRepository;
import com.qw.qwhomes.domains.supplier.service.SupplierService;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierDashboardDTO;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierRequestDTO;
import com.qw.qwhomes.domains.supplier.service.dto.SupplierResponseDTO;
import com.qw.qwhomes.domains.supplier.service.mapper.SupplierMapper;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;
    private final MessageSource messageSource;

    @Override
    @Transactional
    public SupplierResponseDTO createSupplier(SupplierRequestDTO supplierRequestDTO) {
        // Check if a supplier with the same name and registration number already exists
        Optional<Supplier> existingSupplier = supplierRepository.findByNameAndBusinessRegistrationNumber(
            supplierRequestDTO.getName(), supplierRequestDTO.getBusinessRegistrationNumber());
        
        if (existingSupplier.isPresent()) {
            throw new ResourceDuplicateException(
                messageSource.getMessage("supplier.duplicate", 
                    new Object[]{supplierRequestDTO.getName(), supplierRequestDTO.getBusinessRegistrationNumber()}, 
                    LocaleContextHolder.getLocale())
            );
        }

        supplierRequestDTO.setStatus(true);
        supplierRequestDTO.setCreatedBy(QWContext.get().getUserId());
        Supplier supplier = supplierMapper.toEntity(supplierRequestDTO);
        supplier = supplierRepository.save(supplier);
        return supplierMapper.toDto(supplier);
    }

    @Override
    @Transactional
    public SupplierResponseDTO updateSupplier(Long id, SupplierRequestDTO supplierRequestDTO) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        messageSource.getMessage("supplier.not.found", new Object[]{id}, LocaleContextHolder.getLocale())
                ));
        supplierMapper.updateSupplierFromDto(supplierRequestDTO, supplier);
        supplier.setUpdatedBy(QWContext.get().getUserId());
        return supplierMapper.toDto(supplierRepository.save(supplier));
    }

    @Override
    @Transactional
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    messageSource.getMessage("supplier.not.found", new Object[]{id}, LocaleContextHolder.getLocale())
            );
        }
        supplierRepository.deleteById(id);
    }

    @Transactional
    @Override
    public void updateSupplierStatus(Long supplierId, boolean status) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        messageSource.getMessage("supplier.not.found", new Object[]{supplierId}, LocaleContextHolder.getLocale())
                ));
        supplier.setStatus(status);
        supplierRepository.save(supplier);
    }

    @Transactional(readOnly = true)
    @Override
    public SupplierDashboardDTO getSuppliersMetaData() {
        return supplierRepository.getSuppliersMetaData();
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierResponseDTO getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .map(supplierMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException(
                        messageSource.getMessage("supplier.not.found", new Object[]{id}, LocaleContextHolder.getLocale())
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SupplierResponseDTO> getAllSuppliers(Pageable pageable, Map<String,String> queryParams) {
        Specification<Supplier> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (MapUtils.isNotEmpty(queryParams)) {
                if (StringUtils.isNotEmpty(queryParams.get("search"))) {
                    String searchLower = "%" + queryParams.get("search").toLowerCase() + "%";
                    predicates.add(cb.or(
                            cb.like(cb.lower(root.get("name")), searchLower),
                            cb.like(cb.lower(root.get("primaryContactName")), searchLower)
                    ));
                }

                if (StringUtils.isNotEmpty(queryParams.get("status"))) {
                    predicates.add(cb.equal(root.get("status"), Boolean.valueOf(queryParams.get("status"))));
                }

                if (StringUtils.isNotEmpty(queryParams.get("location"))) {
                    String locationLower = "%" + queryParams.get("location").toLowerCase() + "%";
                    predicates.add(cb.or(
                            cb.like(cb.lower(root.get("city")), locationLower),
                            cb.like(cb.lower(root.get("stateProvince")), locationLower),
                            cb.like(cb.lower(root.get("country")), locationLower)
                    ));
                }

                if (StringUtils.isNotEmpty(queryParams.get("category"))) {
                    predicates.add(cb.equal(root.get("category"), queryParams.get("category")));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return supplierRepository.findAll(spec, pageable).map(supplierMapper::toDto);
    }
}
