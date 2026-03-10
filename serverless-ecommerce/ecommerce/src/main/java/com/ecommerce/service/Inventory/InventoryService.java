package com.ecommerce.service.Inventory;


import com.ecommerce.dto.order.OrderItem;

import java.util.List;

public interface InventoryService {

    String saveProductInSTOCK(String id, int stock);

    int getItemQuantity(String stock);

    void checkAndReduceSTOCK(List<OrderItem> items);

    void deleteByID(String stock);
}
