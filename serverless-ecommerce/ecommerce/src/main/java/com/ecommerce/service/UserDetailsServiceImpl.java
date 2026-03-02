package com.ecommerce.service;


import com.ecommerce.modal.User;
import com.ecommerce.repo.EcommerceRepo;
import com.ecommerce.service.Auth.CustomUserDetailService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

   private final EcommerceRepo ecommerceRepo;

    public UserDetailsServiceImpl(EcommerceRepo ecommerceRepo) {
        this.ecommerceRepo = ecommerceRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = ecommerceRepo.findByEmail(username).get();
        if(user==null){
            throw new UsernameNotFoundException("No Such user is present in database");
        }
        return new CustomUserDetailService(user);
    }


}
