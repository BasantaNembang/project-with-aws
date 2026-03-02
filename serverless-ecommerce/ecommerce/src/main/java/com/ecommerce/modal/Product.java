package com.ecommerce.modal;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "product")
public class Product {

    @Id
    private String id;

    private String name;
    private String description;
    private int price;
    private String stock;   //id of inventory
    private String category;
    private String imageUrl;
    private String email; //save seller email


}

