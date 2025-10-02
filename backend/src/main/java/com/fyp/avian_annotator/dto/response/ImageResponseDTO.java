package com.fyp.avian_annotator.dto.response;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record ImageResponseDTO(
        @NotNull String url,
        @NotNull Long workspaceId,
        @NotEmpty String fileName,
        @NotEmpty String bucketKey) {
}
