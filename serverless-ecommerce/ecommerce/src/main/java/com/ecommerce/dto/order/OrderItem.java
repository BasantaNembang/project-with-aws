package com.ecommerce.dto.order;


import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDBDocument
public class OrderItem {

    private String productId;
    private String name;
    private int quantity;
    private double price;
    private String seller;  //email of seller

}

