package com.basanta.controller;


import com.basanta.dto.VideoResponse;
import com.basanta.service.Impl.VideoServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/video")
@CrossOrigin("*")
public class MediaController {

   private final VideoServiceImpl service;

    public MediaController(VideoServiceImpl service) {
        this.service = service;
    }


    @PostMapping("/save")
    public ResponseEntity<Void> saveCourse(@RequestParam("video") MultipartFile video,
                                           @RequestParam("title") String title){
        service.saveVideo(video, title);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


    @GetMapping("/get-all")
    public ResponseEntity<List<VideoResponse>> getVideos(){
        return ResponseEntity.status(HttpStatus.OK).body(service.getAllVideo());
    }

    @GetMapping("/get")
    public Page<VideoResponse> getAllImagesPages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return service.service(pageable);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<String> getVideo(@PathVariable("id") String id){
        return ResponseEntity.status(HttpStatus.OK).body(service.getVideoLink(id));
    }



}


