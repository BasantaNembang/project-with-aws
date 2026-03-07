package org.example.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SellerOrderResponse {

    private String id;
    private String user;
    private List<OrderItem> items;
    private double totalAmount;
    private String orderStatus;

}
