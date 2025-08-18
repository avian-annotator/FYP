package com.fyp.avian_annotator.config;

import com.fyp.avian_annotator.properties.S3Properties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.exception.SdkServiceException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

@Slf4j
@Configuration
@EnableConfigurationProperties(S3Properties.class)
@RequiredArgsConstructor
public class S3Config {

    private final S3Properties s3Properties;
    @Value("${spring.profiles.active:}")
    private String activeProfile;

    @Bean(name = "CustomS3Client")
    public S3Client s3Client(
            @Value("${spring.cloud.aws.region.static}") String region,
            @Value("${spring.cloud.aws.credentials.access-key}") String accessKey,
            @Value("${spring.cloud.aws.credentials.secret-key}") String secretKey) {

        S3Configuration s3Config = S3Configuration.builder()
                .pathStyleAccessEnabled("local".equals(activeProfile))
                .build();

        S3ClientBuilder builder = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .serviceConfiguration(s3Config);

        if ("local".equals(activeProfile) && !s3Properties.getEndpoint().isBlank()) {
            builder.endpointOverride(URI.create(s3Properties.getEndpoint()));
        }
        S3Client s3Client = builder.build();
        ensureBucketExists(s3Client);
        return s3Client;
    }

    @Bean(name = "CustomS3Presigner")
    public S3Presigner s3Presigner(
            @Value("${spring.cloud.aws.region.static}") String region,
            @Value("${spring.cloud.aws.credentials.access-key}") String accessKey,
            @Value("${spring.cloud.aws.credentials.secret-key}") String secretKey) {

        S3Configuration s3Config = S3Configuration.builder()
                .pathStyleAccessEnabled("local".equals(activeProfile))
                .build();

        S3Presigner.Builder builder = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .serviceConfiguration(s3Config);

        if ("local".equals(activeProfile) && !s3Properties.getEndpoint().isBlank()) {
            // For presigner, use localhost instead of internal hostname. Localstax suckky.
            String localhostEndpoint = s3Properties.getEndpoint().replace("localstack-main", "localhost");
            builder.endpointOverride(URI.create(localhostEndpoint));
        }

        return builder.build();
    }


    private void ensureBucketExists(S3Client s3Client) {
        try {
            s3Client.headBucket(HeadBucketRequest.builder()
                    .bucket(s3Properties.getBucketName())
                    .build());
        } catch (S3Exception e) {
            try {
                CreateBucketRequest.Builder builder = CreateBucketRequest.builder()
                        .bucket(s3Properties.getBucketName());

                if (s3Client.serviceClientConfiguration().endpointOverride().isEmpty()) {
                    builder.createBucketConfiguration(
                            CreateBucketConfiguration.builder()
                                    .locationConstraint(BucketLocationConstraint.AP_SOUTHEAST_2)
                                    .build()
                    );
                }
                s3Client.createBucket(builder.build());
            } catch (SdkServiceException ex) {
                log.debug("Bucket {} creation skipped or failed: {}", s3Properties.getBucketName(), ex.getMessage());
            }
        }
    }

}