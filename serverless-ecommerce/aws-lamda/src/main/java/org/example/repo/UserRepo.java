package org.example.repo;


import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import org.example.modal.User;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class UserRepo{

    private final DynamoDBMapper dbMapper;

    public UserRepo(DynamoDBMapper dbMapper) {
        this.dbMapper = dbMapper;
    }


    public User save(User user){
        dbMapper.save(user);
        return user;
    }


    public Optional<User> findByEmail(String email) {

        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":email", new AttributeValue().withS(email));

        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                .withFilterExpression("email = :email")
                .withExpressionAttributeValues(eav);

        List<User> users = dbMapper.scan(User.class, scanExpression);


        if(users.isEmpty()){
            return Optional.empty();
        }

        return users.stream().findFirst();
    }



}
