package com.fyp.avian_annotator.service;

import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Map;

@Service
public interface S3Service {

    void uploadFile(String keyName, String contentType, Map<String, String> metadata, InputStream fileContent);


    String createGetPresignedUrl(String keyName);

    void deleteObject(String keyName);

}
