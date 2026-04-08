package com.basanta.config;


import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudConfig {

    private final String awsAccessKey;
    private final String awsSecretKey;
    private final String region;

    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;

    public CloudConfig(@Value("${cloud.aws.credentials.access-key}") String awsAccessKey,
                       @Value("${cloud.aws.credentials.secret-key}") String awsSecretKey,
                       @Value("${cloud.aws.region.static}") String region,

                       @Value("${cloudinary.cloud-name}") String cloudName,
                       @Value("${cloudinary.api-key}") String apiKey,
                       @Value("${cloudinary.api-secret}") String apiSecret){
        this.awsAccessKey = awsAccessKey;
        this.awsSecretKey = awsSecretKey;
        this.region = region;

        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    //for s3
    @Bean
    public AmazonS3 amazonS3() {

        AWSCredentials awsCredential = new BasicAWSCredentials(awsAccessKey, awsSecretKey);

        AmazonS3 amazonS3 = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredential))
                .withRegion(region)
                .build();

        return amazonS3;
    }


    //for image
    @Bean
    public Cloudinary cloudinary(){
        Map cofig = new HashMap();
        cofig.put("cloud_name", cloudName);
        cofig.put("api_key", apiKey);
        cofig.put("api_secret", apiSecret);
        return new Cloudinary(cofig);
    }



}


