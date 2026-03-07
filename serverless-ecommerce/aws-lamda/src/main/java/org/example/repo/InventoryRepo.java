package org.example.repo;


import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import org.example.modal.Inventory;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Repository
public class InventoryRepo {

    private final DynamoDBMapper dbMapper;

    public InventoryRepo(DynamoDBMapper dbMapper) {
        this.dbMapper = dbMapper;
    }

    public Inventory save(Inventory inventory){
        dbMapper.save(inventory);
        return inventory;
    }

    public Optional<Inventory> findByProductId(String productId){
        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":productId", new AttributeValue().withS(productId));

        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                .withFilterExpression("productId = :productId")
                .withExpressionAttributeValues(eav);

        List<Inventory> inventories = dbMapper.scan(Inventory.class, scanExpression);

        if(inventories.isEmpty()){
            return Optional.empty();
        }


        return inventories.stream().findFirst();
    }



}
