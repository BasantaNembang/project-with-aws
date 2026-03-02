package com.ecommerce.controller;


import com.ecommerce.dto.order.OrderRequest;
import com.ecommerce.dto.order.OrderResponse;
import com.ecommerce.dto.order.SellerOrderResponse;
import com.ecommerce.service.Order.OrderServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderServiceImpl orderService;


    @PostMapping("/create")
    public ResponseEntity<?> makeOrder(@RequestBody OrderRequest request){
        return ResponseEntity.status(HttpStatus.OK)
                .body(orderService.makeOrder(request));
    }


    //for buyers
    @GetMapping("/{email}")
    public ResponseEntity<List<OrderResponse>> makeOrder(@PathVariable("email") String email) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(orderService.getOrders(email));
    }


    //for seller
    @GetMapping("/seller/{email}")
    public ResponseEntity<List<SellerOrderResponse>> getOrderBySeller(@PathVariable("email") String email) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(orderService.getOrderBySeller(email));
    }


}

