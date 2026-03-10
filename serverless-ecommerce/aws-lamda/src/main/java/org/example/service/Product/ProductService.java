package org.example.service.Product;

import org.example.dto.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    String saveProduct(String product, MultipartFile image);

    List<ProductDTO> getAllProduct();

    List<ProductDTO> getMyProduct(String email);

    ProductDTO getProduct(String id);

    String getSellerByPID(String productId);



}
