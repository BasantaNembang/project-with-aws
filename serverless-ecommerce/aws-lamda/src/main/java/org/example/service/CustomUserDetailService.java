package org.example.service;

import org.example.modal.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


public class CustomUserDetailService implements UserDetails {

    //email is the username
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;


    public CustomUserDetailService(User account){
      this.email = account.getEmail();
      this.password = account.getPassword();
      List<GrantedAuthority> authorityList = new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority(account.getRole().toUpperCase()));
       this.authorities =authorityList;

    }

    @Override
    public String getUsername(){
        return email;
    }

    @Override
    public  String getPassword(){
        return password;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }



    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


}
