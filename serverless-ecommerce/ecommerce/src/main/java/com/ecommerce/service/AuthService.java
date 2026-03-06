package com.ecommerce.service;

import com.ecommerce.dto.auth.SignupRequest;
import com.ecommerce.dto.auth.Users;
import com.ecommerce.error.CustomException;
import com.ecommerce.mapper.UserMapper;
import com.ecommerce.modal.User;
import com.ecommerce.repo.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class AuthService {

    private final UserRepo ecommerceRepo;
    private final PasswordEncoder passwordEncoder;


    public AuthService(UserRepo ecommerceRepo, PasswordEncoder passwordEncoder) {
        this.ecommerceRepo = ecommerceRepo;
        this.passwordEncoder = passwordEncoder;
    }


    public Users signupUser(SignupRequest signupRequest){
        //check if exits
        ecommerceRepo.findByEmail(signupRequest.email())
          .ifPresent(user -> {throw new CustomException("User already exists");});

       User user = UserMapper.toEntity(signupRequest);
       user.setPassword(passwordEncoder.encode(signupRequest.password()));
       //save
       ecommerceRepo.save(user);

       return new Users(user.getName(), user.getEmail(), user.getRole());

    }

    public Users getUser(String email){
       return ecommerceRepo.findByEmail(email)
                .map(m->new Users(m.getName(), m.getEmail(), m.getRole()))
                .orElseThrow(()->new CustomException("No user"));
    }

}


