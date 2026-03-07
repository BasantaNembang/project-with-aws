package org.example.repo;


import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import org.example.modal.Order;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Repository
public class OrderRepo {

    private final DynamoDBMapper dbMapper;

    public OrderRepo(DynamoDBMapper dbMapper) {
        this.dbMapper = dbMapper;
    }


    public Order save(Order order){
        dbMapper.save(order);
        return order;
    }

    public List<Order> findAll(){
        return dbMapper.scan(Order.class, new DynamoDBScanExpression());
    }


    public List<Order> findAllByUser(String user) {
        // Map for attribute values
        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":user", new AttributeValue().withS(user));
        // Map for attribute names (for reserved keywords) since user is keyword in dynamoDB
        Map<String, String> ean = new HashMap<>();
        ean.put("#usr", "user"); // use #usr as a placeholder for the 'user' attribute
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                .withFilterExpression("#usr = :user")
                .withExpressionAttributeNames(ean)
                .withExpressionAttributeValues(eav);
        List<Order> orders = dbMapper.scan(Order.class, scanExpression);
        System.out.println("hey dude");
        System.out.println(orders);

        return orders;
    }

}
