package org.example.service;


import org.example.dto.auth.SignupRequest;
import org.example.dto.auth.Users;
import org.example.error.CustomException;
import org.example.mapper.UserMapper;
import org.example.modal.User;
import org.example.repo.UserRepo;
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


