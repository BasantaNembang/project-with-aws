package org.example.dto.auth;

public record LoginRequest(String email,
                           String password) {
}
