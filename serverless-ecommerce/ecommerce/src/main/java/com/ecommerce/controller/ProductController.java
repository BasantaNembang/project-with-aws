package com.ecommerce.controller;

import com.ecommerce.dto.ProductDTO;
import com.ecommerce.service.Product.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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


    @GetMapping("/Images/{imageName}")
    public ResponseEntity<UrlResource> getImages(@PathVariable("imageName") String imageName){
        UrlResource image = productService.getImage(imageName);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/jpeg"))
                .body(image);
    }


    @DeleteMapping("/delete/{pid}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("pid") String pid){
        productService.deleteProduct(pid);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateProduct(@RequestPart("product") String product,
                                          @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.updateTheProduct(product, image));
    }


}
