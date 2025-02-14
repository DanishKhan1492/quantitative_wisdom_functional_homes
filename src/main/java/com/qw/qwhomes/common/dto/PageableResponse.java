package com.qw.qwhomes.common.dto;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class PageableResponse<T> {

    private List<T> data;
    private Integer totalPages;
    private Long totalElements;
    private Integer pageNumber;
    private Integer size;

    public PageableResponse(Page<T> pagedData) {
        this.data = pagedData.getContent();
        this.totalElements = pagedData.getTotalElements();
        this.totalPages = pagedData.getTotalPages();
        this.pageNumber = pagedData.getNumber();
        this.size = pagedData.getSize();
    }
}
