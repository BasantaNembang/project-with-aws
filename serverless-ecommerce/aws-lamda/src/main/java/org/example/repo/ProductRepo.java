package org.example.repo;


import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import org.example.modal.Product;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ProductRepo  {

    private final DynamoDBMapper dbMapper;

    public ProductRepo(DynamoDBMapper dbMapper) {
        this.dbMapper = dbMapper;
    }

    public Product save(Product product){
        dbMapper.save(product);
        return product;
    }

    public List<Product> findAll(){
        return dbMapper.scan(Product.class, new DynamoDBScanExpression());
    }

    public List<Product> findAllByEmail(String email) {

        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":email", new AttributeValue().withS(email));

        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression()
                .withFilterExpression("email = :email")
                .withExpressionAttributeValues(eav);

        List<Product> products = dbMapper.scan(Product.class, scanExpression);

        return products;

    }


    public Product findById(String id){
        return dbMapper.load(Product.class, id);
    }

}
