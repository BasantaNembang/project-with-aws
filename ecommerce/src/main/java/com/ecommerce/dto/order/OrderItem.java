package com.ecommerce.dto.order;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItem {

    private String productId;
    private String name;
    private int quantity;
    private double price;
    private String seller;  //email of seller

}

