package org.example.controller;



import org.example.dto.auth.JwtDto;
import org.example.dto.auth.LoginRequest;
import org.example.dto.auth.SignupRequest;
import org.example.dto.auth.Users;
import org.example.error.CustomException;
import org.example.service.AuthService;
import org.example.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
public class AuthController {

   @Autowired
   private AuthService authService;

   @Autowired
   private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;


    @PostMapping("/signup")
    public ResponseEntity<JwtDto> singUpUser(@RequestBody SignupRequest signupRequest){

        Users user =  authService.signupUser(signupRequest);
        if(user==null){
            throw new CustomException("User not saved");
        }
        String jwtToken  = jwtService.getJwtToken(user.email());

        return ResponseEntity.status(HttpStatus.OK).body(
                JwtDto.builder()
                        .jwtToken(jwtToken)
                        .user(user)
                        .build()
        );
    }



    @PostMapping("/login")
    public ResponseEntity<?> loginInUser(@RequestBody LoginRequest request) {
        try {
            Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.email(), request.password()
            ));
            if (authenticate.isAuthenticated()) {

                return ResponseEntity.status(HttpStatus.OK).body(
                        JwtDto.builder()
                                .jwtToken(jwtService.getJwtToken(request.email()))
                                .user(authService.getUser(request.email()))
                                .build()
                );
            }
            throw new CustomException("Invalid password");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username and password");
        }
    }



}


