package com.basanta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;


@EnableAsync
@SpringBootApplication
public class StorageBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(StorageBackendApplication.class, args);
	}

}
