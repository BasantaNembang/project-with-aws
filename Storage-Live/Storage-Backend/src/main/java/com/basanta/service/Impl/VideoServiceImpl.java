package com.basanta.service.Impl;

import com.basanta.dto.VideoResponse;
import com.basanta.helper.Helper;
import com.basanta.modal.VideoModal;
import com.basanta.repo.VideoRepo;
import com.basanta.service.VideoService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;


@Slf4j
@Service
public class VideoServiceImpl implements VideoService {

    private final String videoUploadDIR;
    private final Helper hslProcesses;
    private final VideoRepo videoRepo;


    public VideoServiceImpl(@Value("${video.upload.dir}") String videoUploadDIR,
                            @Value("${app.s3.bucket}") String bucket,
                            Helper hslProcesses,
                            VideoRepo videoRepo){
        this.videoUploadDIR = videoUploadDIR;
        this.hslProcesses = hslProcesses;
        this.videoRepo = videoRepo;
    }


    @PostConstruct
    public void setUP() {
        try {
            Path path = Paths.get(videoUploadDIR);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
        } catch (Exception e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }


    @Override
    public void saveVideo(MultipartFile video, String title) {
        try{
            String imageName = video.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" +
                    video.getOriginalFilename();
            Path filePath = Paths.get(videoUploadDIR).resolve(fileName);
            Files.copy(video.getInputStream(), filePath,
                    StandardCopyOption.REPLACE_EXISTING);
            log.info("video save successfully  {} ", video.getOriginalFilename());

            hslProcesses.processVideoToHLS(fileName, filePath, imageName, title);
        }
        catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    public List<VideoResponse> getAllVideo() {
       return videoRepo.findAll()
               .stream()
               .filter(VideoModal::isFlag)
               .map(v->new VideoResponse(v.getId(), v.getTitle(),
                        v.getThumbnailURL(), v.getDate().toString()))
               .toList();
    }

    @Override
    public String getVideoLink(String id) {
        return videoRepo.findById(id)
                .map(VideoModal::getVideoURL)
                .orElseThrow(()->new RuntimeException("no data"));
    }


    @Override
    public Page<VideoResponse> service(Pageable pageable) {
         Page<VideoModal> videoModal = videoRepo.findAll(pageable);
         return videoModal.map(v->new VideoResponse(
                 v.getId(),
                 v.getTitle(),
                 v.getThumbnailURL(),
                 v.getDate().toString()
         ));
    }


}

