package com.ecommerce.dto.auth;

public record LoginRequest(String email,
                           String password) {
}
