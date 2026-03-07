package org.example.dto.order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    private List<OrderItem> items;
    private ShippingAddress shippingAddress;
    private String paymentMethod;
    private double totalAmount;
    private String user;

}

