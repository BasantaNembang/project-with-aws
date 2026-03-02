package com.ecommerce.repo;

import com.ecommerce.modal.Inventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface InventoryRepo extends MongoRepository<Inventory, String> {

    Optional<Inventory> findByProductId(String productId);
}
