package org.example.controller;



import org.example.dto.order.OrderRequest;
import org.example.dto.order.OrderResponse;
import org.example.dto.order.SellerOrderResponse;
import org.example.service.Order.OrderServiceImpl;
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


    //for buyers  :: user-> buyer email
    @GetMapping("/{user}")
    public ResponseEntity<List<OrderResponse>> makeOrder(@PathVariable("user") String user) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(orderService.getOrders(user));
    }


    //for seller
    @GetMapping("/seller/{email}")
    public ResponseEntity<List<SellerOrderResponse>> getOrderBySeller(@PathVariable("email") String email) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(orderService.getOrderBySeller(email));
    }


}

