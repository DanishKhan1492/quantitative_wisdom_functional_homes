package com.qw.qwhomes.common.exceptions;

public class ResourceDuplicateException extends RuntimeException {
    public ResourceDuplicateException(String message) {
        super(message);
    }

    public ResourceDuplicateException(String message, Throwable cause) {
        super(message, cause);
    }
}
