package com.basanta.repo;

import com.basanta.modal.VideoModal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface VideoRepo extends MongoRepository<VideoModal, String> {
}
