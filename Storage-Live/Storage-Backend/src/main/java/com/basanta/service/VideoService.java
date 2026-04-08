package com.basanta.service;

import com.basanta.dto.VideoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface VideoService {

    void saveVideo(MultipartFile video, String title);

    List<VideoResponse> getAllVideo();

    String getVideoLink(String id);

    Page<VideoResponse> service(Pageable pageable);
}
