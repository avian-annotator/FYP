package com.fyp.avian_annotator.service.impl;

import com.fyp.avian_annotator.dal.entity.Image;
import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dal.repository.ImageRepository;
import com.fyp.avian_annotator.dal.repository.WorkspaceRepository;
import com.fyp.avian_annotator.dto.response.EditImageDetailsResponseDTO;
import com.fyp.avian_annotator.dto.response.ImageResponseDTO;
import com.fyp.avian_annotator.exception.ImageNotFoundException;
import com.fyp.avian_annotator.exception.NotAllowedException;
import com.fyp.avian_annotator.exception.WorkspaceNotFoundException;
import com.fyp.avian_annotator.service.ImageService;
import com.fyp.avian_annotator.service.S3Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final S3Service s3Service;
    private final WorkspaceRepository workspaceRepository;
    private final ImageRepository imageRepository;


    @Transactional
    @Override
    public String uploadImage(
            Long userId, Long workspaceId, String contentType, String fileName, InputStream inputStream) {
        var workspace =
                workspaceRepository
                        .findByIdAndOwnerId(workspaceId, userId)
                        .orElseThrow(() -> new WorkspaceNotFoundException(workspaceId));

        Image image = Image.builder().fileName(fileName).workspace(workspace).build();
        String bucketKey = workspace.getBucketPrefix() + image.getBucketIdentifier();

        var metaData = Map.of("file-name", fileName);

        s3Service.uploadFile(bucketKey, contentType, metaData, inputStream);

        imageRepository.save(image);

        return image.getBucketIdentifier();
    }

    @Transactional
    @Override
    public EditImageDetailsResponseDTO editImageDetails(
            Long userId, Long workspaceId, String fileName, String imageId) {

        Image image = getImageIfOwned(userId, workspaceId, imageId);

        if (fileName != null) {
            image.setFileName(fileName);
            imageRepository.save(image);
        }
        return new EditImageDetailsResponseDTO(fileName);
    }

    @Override
    public ImageResponseDTO createDownloadPresignedUrlForImage(
            Long userId, Long workspaceId, String bucketIdentifier, Boolean includeAnnotations) {


        var image = getImageIfWorkspaceUser(userId, workspaceId, bucketIdentifier);

        // not n + 1...right?
        var url =
                s3Service.createGetPresignedUrl(
                        image.getWorkspace().getBucketPrefix() + bucketIdentifier);

        if (includeAnnotations != null && includeAnnotations) {
            return new ImageResponseDTO(url, workspaceId, image.getFileName(), image.getBucketIdentifier(), image.getAnnotations());
        }
        return new ImageResponseDTO(url, workspaceId, image.getFileName(), image.getBucketIdentifier(), null);
    }

    @Override
    public Page<ImageResponseDTO> createDownloadPresignedUrlForImages(
            Long userId, Long workspaceId, Boolean includeAnnotations, Pageable pageable) {
        var images = getImagesIfWorkspaceUser(userId, workspaceId, pageable);
        if (includeAnnotations != null && includeAnnotations) {

            return images.map(
                    image -> {
                        var url =
                                s3Service.createGetPresignedUrl(
                                        image.getWorkspace().getBucketPrefix() + image.getBucketIdentifier());
                        return new ImageResponseDTO(
                                url, workspaceId, image.getFileName(), image.getBucketIdentifier(), image.getAnnotations());
                    });
        }
        return images.map(
                image -> {
                    var url =
                            s3Service.createGetPresignedUrl(
                                    image.getBucketIdentifier());
                    return new ImageResponseDTO(url, workspaceId, image.getFileName(), image.getBucketIdentifier(), null);
                });
    }

    @Transactional
    @Override
    public void deleteImage(Long userId, Long workspaceId, String imageId) {
        var image = getImageIfOwned(userId, workspaceId, imageId);

        imageRepository.delete(image);
        s3Service.deleteObject(image.getWorkspace().getBucketPrefix() + image.getBucketIdentifier());

    }

    // Make sure it is the owner making the changes
    private Image getImageIfOwned(Long userId, Long workspaceId, String imageId) {
        var image =
                imageRepository.findById(imageId).orElseThrow(() -> new ImageNotFoundException(imageId));

        var attachedWorkspace = image.getWorkspace();

        if (!Objects.equals(attachedWorkspace.getId(), workspaceId)
                || !Objects.equals(attachedWorkspace.getOwner().getId(), userId)) {
            throw new NotAllowedException();
        }
        return image;
    }

    private Image getImageIfWorkspaceUser(Long userId, Long workspaceId, String imageId) {
        var image =
                imageRepository.findById(imageId).orElseThrow(() -> new ImageNotFoundException(imageId));

        var attachedWorkspace = image.getWorkspace();

        if (!Objects.equals(attachedWorkspace.getId(), workspaceId)
                || attachedWorkspace.getWorkspaceUsers().stream().noneMatch(u -> Objects.equals(u.getUser().getId(), userId))) {
            throw new NotAllowedException();
        }
        return image;
    }

    private Page<Image> getImagesIfWorkspaceUser(Long userId, Long workspaceId, Pageable pageable) {
        Workspace workspace = workspaceRepository
                .findByIdAndWorkspaceUsers_UserId(workspaceId, userId)
                .orElseThrow(NotAllowedException::new);

        return imageRepository.findImageByWorkspaceId(workspace.getId(), pageable);
    }
}
