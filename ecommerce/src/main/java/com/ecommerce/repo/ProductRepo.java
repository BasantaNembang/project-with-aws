package com.ecommerce.repo;

import com.ecommerce.modal.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductRepo  extends MongoRepository<Product, String> {

    List<Product> findAllByEmail(String email);



}
