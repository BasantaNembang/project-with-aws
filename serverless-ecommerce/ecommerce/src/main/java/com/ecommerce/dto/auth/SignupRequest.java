package com.ecommerce.dto.auth;

public record SignupRequest(
         String name,
         String email,
         String password,
         String role
) {
}
