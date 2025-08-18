package com.fyp.avian_annotator.service.impl;

import com.fyp.avian_annotator.properties.S3Properties;
import com.fyp.avian_annotator.service.S3Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.InputStream;
import java.time.Duration;
import java.util.Map;

@Service
@Slf4j
public class S3ServiceImpl implements S3Service {

    @Autowired
    @Qualifier("CustomS3Presigner")
    private S3Presigner presigner;

    @Autowired
    @Qualifier("CustomS3Client")
    private S3Client s3Client;

    @Autowired
    private S3Properties s3Properties;


    @Override
    public void uploadFile(String key, String mediaType, Map<String, String> metadata, InputStream fileContent) {
        String bucketName = s3Properties.getBucketName();
        try {
            s3Client.putObject(
                    software.amazon.awssdk.services.s3.model.PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(mediaType)
                            .metadata(metadata)
                            .build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromInputStream(fileContent, fileContent.available()));
        } catch (S3Exception e) {
            log.error("Failed to upload file {} to bucket {}: {}", key, bucketName, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while uploading file {} to bucket {}: {}", key, bucketName, e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public String createGetPresignedUrl(String key) {
        String bucketName = s3Properties.getBucketName();
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        GetObjectPresignRequest getPresignRequest = GetObjectPresignRequest.builder()
                .getObjectRequest(getObjectRequest)
                .signatureDuration(Duration.ofMinutes(10))
                .build();

        PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(getPresignRequest);
        return presignedRequest.url().toExternalForm();
    }

    @Override
    public void deleteObject(String key) {

        String bucketName = s3Properties.getBucketName();
        if (!doesKeyExist(bucketName, key)) {
            log.warn("Attempted to delete non-existing object {} from bucket {}", key, bucketName);
            return; // No need to delete if the object does not exist
        }

        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        try {
            s3Client.deleteObject(deleteObjectRequest);
        } catch (S3Exception e) {
            log.error("Failed to delete object {} from bucket {}: {}", key, bucketName, e.getMessage());
        }
    }

    public boolean doesKeyExist(String bucketName, String key) {
        try {
            s3Client.headObject(HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build());
            return true; // object exists
        } catch (NoSuchKeyException e) {
            return false; // object does not exist
        } catch (S3Exception e) {
            if (e.statusCode() == 404) return false; // object not found
            throw e; // other S3 errors
        }
    }


}
