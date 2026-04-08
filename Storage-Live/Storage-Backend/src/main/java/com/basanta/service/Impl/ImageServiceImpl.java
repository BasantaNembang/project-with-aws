package com.basanta.service.Impl;

import com.basanta.dto.ImageResponse;
import com.basanta.helper.Helper;
import com.basanta.modal.Image;
import com.basanta.repo.ImageRepo;
import com.basanta.service.ImageService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


@Service
public class ImageServiceImpl implements ImageService {

    private final ImageRepo repo;
    private final Helper helper;

    public ImageServiceImpl(ImageRepo repo, Helper helper) {
        this.repo = repo;
        this.helper = helper;
    }


    @Override
    public String saveImage(MultipartFile image, String caption) {

        String url = helper.uploadInCLOUDINARY(image);
        Image img = new Image();
        img.setId(UUID.randomUUID().toString().substring(0, 8));
        img.setUrl(url);
        img.setCaption(caption);
        img.setTimestamp(LocalDate.now());

        repo.save(img);
        return "Image saved successfully";
    }



    @Override
    public List<ImageResponse> getAllImages() {
        return repo.findAll()
                .stream()
                .map(image -> new ImageResponse(image.getId(), image.getCaption(),
                        image.getUrl(), image.getTimestamp().toString()))
                .toList();
    }



    @Override
    public Page<Image> findImagesPages(Pageable pageable) {
        return repo.findAll(pageable);
    }









}
