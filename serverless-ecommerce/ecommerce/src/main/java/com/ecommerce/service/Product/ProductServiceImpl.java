package com.ecommerce.service.Product;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.ecommerce.dto.ProductDTO;
import com.ecommerce.modal.Product;
import com.ecommerce.repo.ProductRepo;
import com.ecommerce.service.Inventory.InventoryServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private InventoryServiceImpl inventoryService;

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${app.s3.bucket}")
    private String bucket;

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

        String imageURL = uploadInAWS(image);

        //can be used for certain period of time
       // String url = preSignedURL(imageURL);

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


    private String uploadInAWS(MultipartFile image)  {

        String originalName = image.getOriginalFilename();
        String fileExtension = "";

        if (originalName != null && originalName.contains(".")) {
            fileExtension = originalName.substring(originalName.lastIndexOf("."));
        }

        String imageName = UUID.randomUUID() + fileExtension;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(image.getSize());
        metadata.setContentType(image.getContentType());

        try {
            PutObjectResult putObjectRequest = amazonS3.putObject(bucket, imageName, image.getInputStream(), metadata);

           // return imageName;
            return amazonS3.getUrl(bucket, imageName).toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }


    private String preSignedURL(String imageURL) {
        GeneratePresignedUrlRequest request = new
                GeneratePresignedUrlRequest(bucket, imageURL)
                .withMethod(HttpMethod.GET);

        URL url = amazonS3.generatePresignedUrl(request);
        return url.toString();
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
