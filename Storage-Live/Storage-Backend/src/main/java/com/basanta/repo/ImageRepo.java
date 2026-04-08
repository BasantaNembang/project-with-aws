package com.basanta.repo;

import com.basanta.modal.Image;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ImageRepo extends MongoRepository<Image, String> {
}
