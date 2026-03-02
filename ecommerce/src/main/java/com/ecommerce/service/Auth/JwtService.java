package com.ecommerce.service.Auth;

import com.ecommerce.modal.User;
import com.ecommerce.repo.EcommerceRepo;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Service
public class JwtService {


    @Value("${jwt.secret}")
    private String theKEY;

    @Autowired
    EcommerceRepo ecommerceRepo;


    public String getJwtToken(String email) {
        User user = ecommerceRepo.findByEmail(email).get();

        if(user==null){
            throw new UsernameNotFoundException("unable to create JWT token cause");
        }

        Map<String, Object> cls = new HashMap<>();
        cls.put("roles", user.getRole());
        return Jwts.builder()
                .claims()
                .add(cls)
                .setSubject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() +  3600000)) // 60 mins
                .and()
                .signWith(getSecretKey(),  SignatureAlgorithm.HS256).compact();    }


    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }


    private <T> T extractClaim(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }


    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }



    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(theKEY.getBytes(StandardCharsets.UTF_8));
    }

    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }


    private Boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}
