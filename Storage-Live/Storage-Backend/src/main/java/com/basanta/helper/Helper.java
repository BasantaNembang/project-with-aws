package com.basanta.helper;


import com.basanta.modal.VideoModal;

import com.basanta.repo.VideoRepo;
import com.cloudinary.Cloudinary;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.amazonaws.services.s3.AmazonS3;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
public class Helper {

    private final AmazonS3 amazonS3;
    private final String bucket;
    private final String basePath;
    private final VideoRepo videoRepo;
    private final Cloudinary cloudinary;


    public Helper(AmazonS3 amazonS3,
                  @Value("${app.s3.bucket}") String bucket,
                  @Value("${video.base-path}") String basePath,
                  VideoRepo videoRepo, Cloudinary cloudinary) {
        this.amazonS3 = amazonS3;
        this.bucket = bucket;
        this.basePath = basePath;
        this.videoRepo = videoRepo;
        this.cloudinary = cloudinary;
    }


    @Async
    public void processVideoToHLS(String fileName, Path filePath, String imageName, String title)
            throws IOException, InterruptedException {

        String inputPath = "/data/" + fileName;

        Path videoDir = Paths.get("/data/hls").resolve(fileName);

        //for s3
        Path videoDirS3 = Paths.get(basePath, "hls", fileName);

        //for thumbnail
        Path thumbnailDir = Paths.get("/data/thumbnails");
        String cleanName = imageName.replace(".mp4", "");

        Files.createDirectories(videoDir);
        Files.createDirectories(thumbnailDir);

        // in java \\ == \ so replace that
        String outputDirStr = videoDir.toString().replace("\\", "/");
        String thumbnailPath = thumbnailDir.resolve(cleanName + ".jpg")
                .toString().replace("\\", "/");


        List<String> command = new ArrayList<>();
        command.add("docker");
        command.add("exec");
        command.add("ffmpeg-container");

        command.add("ffmpeg");
        command.add("-y");
        command.add("-i");
        command.add(inputPath);

        command.add("-c:v");
        command.add("libx264");
        command.add("-c:a");
        command.add("aac");

        // Split both video and audio
        command.add("-filter_complex");
        command.add("[0:v]split=3[v0][v1][v2];" +
                "[v0]scale=w=640:h=360[v0out];" +
                "[v1]scale=w=1280:h=720[v1out];" +
                "[v2]scale=w=1920:h=1080[v2out];" +
                "[0:a]asplit=3[a0][a1][a2]");

        // Map scaled videos
        command.add("-map");
        command.add("[v0out]");
        command.add("-b:v:0");
        command.add("800k");

        command.add("-map");
        command.add("[v1out]");
        command.add("-b:v:1");
        command.add("2800k");

        command.add("-map");
        command.add("[v2out]");
        command.add("-b:v:2");
        command.add("5000k");

        // Map split audio streams (now separate streams)
        command.add("-map");
        command.add("[a0]");
        command.add("-map");
        command.add("[a1]");
        command.add("-map");
        command.add("[a2]");

        command.add("-var_stream_map");
        command.add("v:0,a:0 v:1,a:1 v:2,a:2");  // Important: different a: indices!

        command.add("-master_pl_name");
        command.add("master.m3u8");

        command.add("-f");
        command.add("hls");
        command.add("-hls_time");
        command.add("10");
        command.add("-hls_list_size");
        command.add("0");
        command.add("-hls_segment_filename");
        command.add(outputDirStr + "/v%v/seg%03d.ts");
        command.add(outputDirStr + "/v%v/index.m3u8");

        System.out.println("Executing command: " + String.join(" ", command));

        Process process = new ProcessBuilder(command)
                .inheritIO()
                .start();

        int exitCode = process.waitFor();


        //for thumbnail image
        List<String> thumbCommand = new ArrayList<>();

        thumbCommand.add("docker");
        thumbCommand.add("exec");
        thumbCommand.add("ffmpeg-container");

        thumbCommand.add("ffmpeg");
        thumbCommand.add("-y");
        thumbCommand.add("-i");
        thumbCommand.add(inputPath);

        thumbCommand.add("-ss");
        thumbCommand.add("00:00:02");

        thumbCommand.add("-frames:v");
        thumbCommand.add("1");


        thumbCommand.add("-vf");
        thumbCommand.add("scale=320:180:force_original_aspect_ratio=increase,crop=320:180");

        thumbCommand.add("-update");
        thumbCommand.add("1");

        thumbCommand.add(thumbnailPath);

        log.info("Generating thumbnail...");

        Process thumbProcess = new ProcessBuilder(thumbCommand).inheritIO().start();
        int thumbExit = thumbProcess.waitFor();

        String thumbnailURL = null;
        if(thumbExit == 0){
            Path path = Paths.get(basePath, "thumbnails");
            Path thumanilPath = path.resolve(cleanName + ".jpg");
            thumbnailURL  = uploadThumbnailToCLOUDINARY(thumanilPath);

            if(thumbnailURL!=null){  //delete the thumbnail image
               Files.delete(thumanilPath);
            }
        }


        //DB stuffs
        VideoModal video = new VideoModal();
        video.setId(UUID.randomUUID().toString().substring(0,8));
        video.setTitle(title);

        if (exitCode != 0 || thumbExit!=0) {
            video.setFlag(false);
            video.setThumbnailURL("null");
            video.setVideoURL("null");
            log.info("processing fail");
        }else{
            video.setFlag(true);
            video.setThumbnailURL(thumbnailURL);
            video.setVideoURL("http://localhost:9292/hls/" + fileName + "/master.m3u8");
            log.info("processing success");
            //videoDir
            storeVideoS3(videoDirS3, filePath);
        }
        video.setDate(LocalDate.now());

        log.info("saving the video {}",  video);
        videoRepo.save(video);

    }


    private void storeVideoS3(Path videoDirS3, Path filePath) throws IOException {

        log.info("videoDirS3 {}",  videoDirS3);

        Files.walk(videoDirS3)  //uploading to s3
                .filter(Files::isRegularFile)
                .forEach(f -> {

                    String key = "hls/" +
                            videoDirS3.getFileName() + "/" +
                            videoDirS3.relativize(f)
                                    .toString()
                                    .replace("\\", "/");

                    try {
                        amazonS3.putObject(bucket, key, f.toFile());
                    } catch (Exception e) {
                        log.error("video unable to upload in s3");
                       throw new RuntimeException(e.getMessage());
                    }
                });

        log.info("deleting the video");
        //for rawVideo
        log.info("filepath  {} ",  filePath);
        Files.deleteIfExists(filePath);

        //for hsl
        log.info("videoDirS3  {} ",  videoDirS3);

        if(Files.exists(videoDirS3)){
            Files.walk(videoDirS3)
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(path ->{
                        try {
                            Files.delete(path.toPath());
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    });
        }
        log.info("completed........");
    }



    public String uploadInCLOUDINARY(MultipartFile image) {
        try {
            Map map = this.cloudinary.uploader().upload(image.getBytes(), Map.of());
            return map.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }



    private String uploadThumbnailToCLOUDINARY(Path thumanilPath) {
        try {
            Map map = this.cloudinary.uploader().upload(thumanilPath.toFile(), Map.of());
            return map.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }



}
