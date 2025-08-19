package com.bahattintok.e_commerce.event;

import com.bahattintok.e_commerce.model.User;

import lombok.Getter;

@Getter
public class UserRegisteredEvent extends EmailEvent {
    private final User user;
    private final String verificationToken;
    
    public UserRegisteredEvent(Object source, User user, String verificationToken) {
        super(source, user.getEmail(), "Hesabınızı Doğrulayın - " + user.getFirstName());
        this.user = user;
        this.verificationToken = verificationToken;
    }
}
