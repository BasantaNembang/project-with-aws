package com.basanta.secuirty;

import com.basanta.helper.CustomUserDetailService;
import com.basanta.helper.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.context.ApplicationContext;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

       String path =  request.getServletPath();

       if(path.equals("/auth/login")){
           filterChain.doFilter(request, response);
           return;
       }


        String authHeader = request.getHeader("Authorization");
        String token = null;
        String usename = null;

        if(request.getCookies()!=null){
            for(var cookie: request.getCookies()){
                if(cookie.getName().equals("jwtToken")){
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if(token!=null){
            usename = jwtService.getUsernameByToken(token);
        }

        if(usename!=null && SecurityContextHolder.getContext().getAuthentication() == null){

            UserDetails userDetails = context.getBean(CustomUserDetailService.class).loadUserByUsername(usename);
            if(jwtService.validateToken(token)){
                UsernamePasswordAuthenticationToken token1 =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                token1.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(token1);
            }
        }
        filterChain.doFilter(request, response);
    }




}
