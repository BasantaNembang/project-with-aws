package com.basanta.service.Impl;


import com.basanta.repo.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean authenticateUser(String email, String password) {
        System.out.println(email + "email");
        System.out.println("userRepo.findByEmail(email)   " + userRepo.findByEmail(email));
        return userRepo.findByEmail(email)
                .map(u -> passwordEncoder.matches(password, u.getPassword()))
                .orElse(false);
    }




}
