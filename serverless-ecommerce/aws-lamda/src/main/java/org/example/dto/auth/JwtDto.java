package org.example.dto.auth;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class JwtDto {
    String jwtToken;
    Users user;
}
