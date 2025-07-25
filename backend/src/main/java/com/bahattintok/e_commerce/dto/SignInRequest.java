package com.bahattintok.e_commerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kullanıcı giriş (signin) isteklerinde kullanılan DTO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignInRequest {
    
    /**
     * Kullanıcı email adresi
     */
    @NotBlank(message = "Email is required")
    private String email;
    
    /**
     * Kullanıcı şifresi
     */
    @NotBlank(message = "Password is required")
    private String password;
} 