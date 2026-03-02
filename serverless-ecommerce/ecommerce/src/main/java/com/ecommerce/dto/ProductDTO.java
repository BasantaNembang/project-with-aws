package com.ecommerce.dto;

public record ProductDTO(
                         String productId,
                         String name,
                         String description,
                         int price,
                         int stock,
                         String category,
                         String image ,
                         String email) {
}
