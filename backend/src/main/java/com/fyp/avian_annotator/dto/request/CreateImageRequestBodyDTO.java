package com.fyp.avian_annotator.dto.request;

import jakarta.validation.constraints.NotNull;
import org.springframework.http.MediaType;

/**
 * DTO for creating a new image.
 *
 * <p>Frontend must enforce that only supported image types are sent, e.g., JPEG, PNG, GIF, BMP,
 * WebP, TIFF, SVG.
 *
 * @param fileName The original filename of the image. Must not be empty. Only exception for being
 *     notempty, as it is the original filename.
 * @param contentType The MIME type of the image. Must not be null. Frontend must restrict to
 *     allowed image types.
 */
public record CreateImageRequestBodyDTO(@NotNull String fileName, @NotNull MediaType contentType) {}
