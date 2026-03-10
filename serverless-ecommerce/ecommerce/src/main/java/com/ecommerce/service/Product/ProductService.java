package com.ecommerce.service.Product;

import com.ecommerce.dto.ProductDTO;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    String saveProduct(String product, MultipartFile image);

    UrlResource getImage(String image);

    List<ProductDTO> getAllProduct();

    List<ProductDTO> getMyProduct(String email);

    ProductDTO getProduct(String id);

    String getSellerByPID(String productId);

    void deleteProduct(String pid);

    String updateTheProduct(String product, MultipartFile image);
}
