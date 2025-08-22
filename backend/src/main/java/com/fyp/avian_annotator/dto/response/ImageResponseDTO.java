package com.fyp.avian_annotator.dto.response;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record ImageResponseDTO(
    @NotNull String url,
    @NotNull Long workspaceId,
    @NotEmpty String fileName,
    @NotEmpty String bucketKey,
    Map<String, Object> annotations) {}
