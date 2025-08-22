package com.fyp.avian_annotator.service;

import java.io.InputStream;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public interface S3Service {

  void uploadFile(
      String keyName,
      String contentType,
      Map<String, String> metadata,
      InputStream fileContent,
      Long size);

  String createGetPresignedUrl(String keyName);

  void deleteObject(String keyName);
}
