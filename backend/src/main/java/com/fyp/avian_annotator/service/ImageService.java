package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dto.response.EditImageDetailsResponseDTO;
import com.fyp.avian_annotator.dto.response.ImageResponseDTO;
import java.io.InputStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ImageService {

  String uploadImage(
      Long userId,
      Long workspaceId,
      String contentType,
      String fileName,
      InputStream inputStream,
      Long size);

  EditImageDetailsResponseDTO editImageDetails(
      Long userId, Long workspaceId, String fileName, String imageId);

  ImageResponseDTO createDownloadPresignedUrlForImage(
      Long userId, Long workspaceId, String bucketKey, Boolean includeAnnotations);

  Page<ImageResponseDTO> createDownloadPresignedUrlForImages(
      Long userId, Long workspaceId, Boolean includeAnnotations, Pageable pageable);

  void deleteImage(Long userId, Long workspaceId, String imageId);
}
