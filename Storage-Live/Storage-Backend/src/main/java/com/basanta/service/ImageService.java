package com.basanta.service;

import com.basanta.dto.ImageResponse;
import com.basanta.modal.Image;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {

   String saveImage(MultipartFile image, String caption);

   List<ImageResponse> getAllImages();

   Page<Image> findImagesPages(Pageable pageable);
}
