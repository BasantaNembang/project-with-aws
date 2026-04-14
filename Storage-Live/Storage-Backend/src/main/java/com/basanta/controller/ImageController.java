package com.basanta.controller;


import com.basanta.dto.ImageResponse;
import com.basanta.modal.Image;
import com.basanta.service.Impl.ImageServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/image")
@CrossOrigin(origins = "${app.frontend.url}", allowCredentials = "true")
public class ImageController {

    private final ImageServiceImpl service;

    public ImageController(ImageServiceImpl service) {
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveImage(@RequestParam("image") MultipartFile image,
                                            @RequestParam("caption") String caption){
        return ResponseEntity.status(HttpStatus.OK).body(service.saveImage(image, caption));
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<ImageResponse>> getAllImages(){
        return ResponseEntity.status(HttpStatus.OK).body(service.getAllImages());
    }

    @GetMapping("/get")
    public Page<Image> getAllImagesPages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return service.findImagesPages(pageable);
    }

}
