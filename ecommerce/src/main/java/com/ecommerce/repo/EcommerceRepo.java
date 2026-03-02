package com.ecommerce.repo;

import com.ecommerce.modal.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EcommerceRepo extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

}
