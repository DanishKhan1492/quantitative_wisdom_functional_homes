package com.qw.qwhomes.common.exceptions;

public class QWIOException extends RuntimeException {
    public QWIOException(String message) {
        super(message);
    }

    public QWIOException(String message, Throwable cause) {
        super(message, cause);
    }
}
