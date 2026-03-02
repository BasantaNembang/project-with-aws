package com.ecommerce.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderResponse {

    private String id;
    private List<OrderItem> items;
    private String orderStatus;
    private double totalAmount;
    private Instant createdAt;


}
