package com.qw.qwhomes.config;

import lombok.Getter;
import org.springframework.stereotype.Component;

@Getter
@Component
public class QWContext {
    private static final ThreadLocal<QWContext> CONTEXT = new ThreadLocal<>();

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;

    public static void set(QWContext context) {
        CONTEXT.set(context);
    }

    public static QWContext get() {
        return CONTEXT.get();
    }

    public QWContext setUserId(Long userId) {
        this.userId = userId;
        return this;
    }

    public QWContext setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public QWContext setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public QWContext setEmail(String email) {
        this.email = email;
        return this;
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
