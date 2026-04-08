package com.basanta.modal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "video")
public class VideoModal {
    
    @Id
    private String id;
    private boolean flag;
    private String title;
    private String thumbnailURL;
    private String videoURL;
    private LocalDate date;


}


