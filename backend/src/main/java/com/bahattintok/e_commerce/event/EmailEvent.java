package com.bahattintok.e_commerce.event;

import org.springframework.context.ApplicationEvent;

import lombok.Getter;

@Getter
public abstract class EmailEvent extends ApplicationEvent {
    private final String email;
    private final String subject;
    
    public EmailEvent(Object source, String email, String subject) {
        super(source);
        this.email = email;
        this.subject = subject;
    }
}
