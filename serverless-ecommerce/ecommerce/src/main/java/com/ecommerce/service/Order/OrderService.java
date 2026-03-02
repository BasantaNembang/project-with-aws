package com.ecommerce.service.Order;

import com.ecommerce.dto.order.OrderRequest;
import com.ecommerce.dto.order.OrderResponse;
import com.ecommerce.dto.order.SellerOrderResponse;
import com.ecommerce.modal.Order;

import java.util.List;

public interface OrderService {
    Order makeOrder(OrderRequest request);

    List<OrderResponse> getOrders(String email);

    List<SellerOrderResponse> getOrderBySeller(String email);
}
