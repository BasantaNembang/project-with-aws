package org.example.controller;


import org.example.dto.ProductDTO;
import org.example.service.Product.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductServiceImpl productService;


    @PostMapping("/save")
    public ResponseEntity<?> addProduct(@RequestPart("product") String product,
                                             @RequestPart("image") MultipartFile image ){
        return ResponseEntity.status(HttpStatus.OK)
                .body(productService.saveProduct(product, image));
    }

    //get all products
    @GetMapping("/get-all")
    public ResponseEntity<List<ProductDTO>> getProduct() {
        return ResponseEntity.status(HttpStatus.OK).body(productService.getAllProduct());
    }

    //get all product by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable("id") String id) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.getProduct(id));
    }


    //get all by seller
    @GetMapping("/seller/my-products/{email}")
    public ResponseEntity<List<ProductDTO>> getMyProduct(@PathVariable("email") String email) {
        List<ProductDTO> productDTOS = productService.getMyProduct(email);
        return ResponseEntity.status(HttpStatus.OK).body(productDTOS);
    }





}
