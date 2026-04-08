package com.basanta.controller;


import com.basanta.dto.AuthDTO;
import com.basanta.helper.JwtService;
import com.basanta.service.Impl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthServiceImpl authService;
    private final JwtService jwtService;

    public AuthController(AuthServiceImpl authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }


    @PostMapping("/login")
    public ResponseEntity<?> saveCourse(@RequestBody AuthDTO authDTO,
                                        HttpServletResponse response){
        if(!authService.authenticateUser(authDTO.getEmail(), authDTO.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }
        String jwtToken = jwtService.getJwtToken(authDTO.getEmail());

        ResponseCookie cookie = ResponseCookie.from("jwtToken", jwtToken)
                .httpOnly(true)
                .path("/")
                .maxAge(10 * 60 * 60)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.status(HttpStatus.OK)
                .body("success");
    }


    @GetMapping("/check")
    public ResponseEntity<String> isLoggedIn(){
        return ResponseEntity.status(HttpStatus.OK).body("isLoggedIN");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logOut(HttpServletResponse response){
        ResponseCookie cookie = ResponseCookie.from("jwtToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.status(HttpStatus.OK)
                .body("logout successfully");
    }


}




