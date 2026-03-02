package com.ecommerce.modal;

import com.ecommerce.dto.order.OrderItem;
import com.ecommerce.dto.order.ShippingAddress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@Document(collection = "orders")
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    private String id;

    private List<OrderItem> items;
    private ShippingAddress shippingAddress;
    private String paymentMethod;
    private double totalAmount;
    private String orderStatus;

    private Instant createdAt;

    private String user; //email

}

