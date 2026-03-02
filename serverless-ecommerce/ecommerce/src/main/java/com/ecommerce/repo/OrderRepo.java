package com.ecommerce.repo;

import com.ecommerce.modal.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrderRepo extends MongoRepository<Order, String> {

    List<Order> findAllByUser(String email);

}
