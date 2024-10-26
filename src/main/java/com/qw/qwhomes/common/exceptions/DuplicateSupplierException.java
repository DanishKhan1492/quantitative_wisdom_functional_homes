package com.qw.qwhomes.common.exceptions;

public class DuplicateSupplierException extends RuntimeException {
    public DuplicateSupplierException(String message) {
        super(message);
    }

    public DuplicateSupplierException(String message, Throwable cause) {
        super(message, cause);
    }
}
