package org.example.service.Order;



import org.example.dto.order.OrderItem;
import org.example.dto.order.OrderRequest;
import org.example.dto.order.OrderResponse;
import org.example.dto.order.SellerOrderResponse;
import org.example.modal.Order;
import org.example.repo.OrderRepo;
import org.example.service.Inventory.InventoryServiceImpl;
import org.example.service.Product.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService{

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private ProductServiceImpl productService;

    @Autowired
    private InventoryServiceImpl inventoryService;

    @Override
    public Order makeOrder(OrderRequest request) {
        //reduce the quantity of inventory -----------
        inventoryService.checkAndReduceSTOCK(request.getItems());

        Order order = new Order();

        List<OrderItem> itemsWithSeller = request.getItems().stream()
                .peek(item -> item.setSeller(productService.getSellerByPID(item.getProductId())))
                .collect(Collectors.toList());
        order.setItems(itemsWithSeller);

        // Set other order details
        //order.setId(UUID.randomUUID().toString().substring(0, 6));
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingAddress(request.getShippingAddress());
        order.setOrderStatus("SUCCESS");
        order.setCreatedAt(Instant.now().toString());
        order.setUser(request.getUser());

        // Calculate total amount if not provided
        double totalAmount = itemsWithSeller.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        order.setTotalAmount(totalAmount);

        // Save and return
        orderRepo.save(order);
        return order;
    }

    @Override
    public List<OrderResponse> getOrders(String user) {
        List<Order> orders = orderRepo.findAllByUser(user);

        List<OrderResponse> responses = new ArrayList<>();
        for (Order o : orders) {
            double totalAmount = o.getItems().stream()
                    .mapToDouble(item -> item.getPrice() * item.getQuantity())
                    .sum();


            OrderResponse response = OrderResponse.builder()
                    .id(o.getId())  // use order's actual ID
                    .items(o.getItems())
                    .orderStatus(o.getOrderStatus())
                    .totalAmount(totalAmount)
                    .createdAt(o.getCreatedAt().toString())
                    .build();

            responses.add(response);
        }
        return responses;
    }


      @Override
      public List<SellerOrderResponse> getOrderBySeller(String email) {
      return orderRepo.findAll()
            .stream()
            .filter(order -> order.getItems()
                    .stream()
                    .anyMatch(item -> email.equals(item.getSeller())))
            .map(order -> {
                List<OrderItem> sellerItems = order.getItems()
                        .stream()
                        .filter(item -> email.equals(item.getSeller()))
                        .toList();
                double sellerTotal = sellerItems.stream()
                        .mapToDouble(i -> i.getPrice() * i.getQuantity())
                        .sum();

                return SellerOrderResponse.builder()
                        .id(order.getId())
                        .user(order.getUser())
                        .items(sellerItems)
                        .totalAmount(sellerTotal)
                        .orderStatus(order.getOrderStatus())
                        .build();
            })
            .toList();
    }



}
