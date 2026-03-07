package org.example.service.Product;

import com.cloudinary.Cloudinary;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.ProductDTO;
import org.example.modal.Product;
import org.example.repo.ProductRepo;
import org.example.service.Inventory.InventoryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private InventoryServiceImpl inventoryService;

    @Value("${app.s3.bucket}")
    private String bucket;

    @Autowired
    private Cloudinary cloudinary;

    final String basePath = "http://localhost:8080/products/Images/";


    @Override
    public String saveProduct(String product, MultipartFile image) {
        ObjectMapper mapper = new ObjectMapper();
        ProductDTO prod = null;
        try {
            prod  =  mapper.readValue(product, ProductDTO.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        Product productModal = new Product();
        String id = UUID.randomUUID().toString().substring(0, 6);

        productModal.setId(id);

        String imageURL = uploadInCLOUDINARY(image);

        productModal.setImageUrl(imageURL);

        //to store locally
        //String imageURL = saveImage(image);
        //for inventory
        String inventoryID = inventoryService
                .saveProductInSTOCK(id, prod.stock());

        productModal.setStock(inventoryID);
        productModal.setName(prod.name());
        productModal.setCategory(prod.category());
        productModal.setDescription(prod.description());
        productModal.setPrice(prod.price());
        productModal.setEmail(prod.email());

        productRepo.save(productModal);
        return "product added successfully";
    }


    private String uploadInCLOUDINARY(MultipartFile image) {
        try {
            Map map = this.cloudinary.uploader().upload(image.getBytes(), Map.of());
            return map.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }





    @Override
    public UrlResource getImage(String imageName) {
        Path dir = Paths.get(System.getProperty("user.dir"), "Images");

        Path path = dir.resolve(imageName);

        UrlResource urlResource = null;
        try {
            urlResource = new UrlResource(path.toUri());
            return urlResource;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }


    @Override
    public List<ProductDTO> getAllProduct() {
              return productRepo.findAll()
                      .stream()
                      .map(m->new ProductDTO(m.getId(),  m.getName(), m.getDescription(), m.getPrice(),
                        inventoryService.getItemQuantity(m.getId()), m.getCategory(), m.getImageUrl(), m.getEmail()))
                .collect(Collectors.toList());
    }


    @Override
    public List<ProductDTO> getMyProduct(String email) {
        return productRepo.findAllByEmail(email)
                .stream()
                .map(m->new ProductDTO(m.getId(), m.getName(), m.getDescription(), m.getPrice(),
                        inventoryService.getItemQuantity(m.getId()), m.getCategory(), m.getImageUrl(), m.getEmail()))
                .collect(Collectors.toList());
    }



    @Override
    public ProductDTO getProduct(String id) {
        Product p = productRepo.findById(id);
        return new ProductDTO(p.getId(), p.getName(),p.getDescription(),p.getPrice(),
                      inventoryService.getItemQuantity(p.getStock()),p.getCategory(),p.getImageUrl(),p.getEmail());

    }



    @Override
    public String getSellerByPID(String productId) {
       return productRepo.findById(productId)
               .getEmail();
    }




    private String saveImage(MultipartFile image) {
        try{
            String imageName = image.getOriginalFilename() + "_" + System.currentTimeMillis();

            Path userDir = Paths.get(System.getProperty("user.dir"), "Images");

            Files.createDirectories(userDir);

            Path path = userDir.resolve(imageName);
            Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return basePath + imageName;
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


}
