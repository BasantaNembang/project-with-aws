package org.example.service.Order;



import org.example.dto.order.OrderRequest;
import org.example.dto.order.OrderResponse;
import org.example.dto.order.SellerOrderResponse;
import org.example.modal.Order;

import java.util.List;

public interface OrderService {
    Order makeOrder(OrderRequest request);

    List<OrderResponse> getOrders(String email);

    List<SellerOrderResponse> getOrderBySeller(String email);
}
