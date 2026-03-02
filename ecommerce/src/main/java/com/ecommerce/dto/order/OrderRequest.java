package com.ecommerce.dto.order;
import lombok.Builder;
import lombok.Data;

import java.util.List;


@Data
@Builder
public class OrderRequest {

    private List<OrderItem> items;
    private ShippingAddress shippingAddress;
    private String paymentMethod;
    private double totalAmount;
    private String user;

}

