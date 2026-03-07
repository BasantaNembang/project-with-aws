package org.example.mapper;


import org.example.dto.auth.SignupRequest;
import org.example.modal.User;

public class UserMapper {

    public static User toEntity(SignupRequest request){
        User user = new User();
        user.setRole(request.role());
        user.setPassword(request.password());
        user.setName(request.name());
        user.setEmail(request.email());
        return user;
    }


}
