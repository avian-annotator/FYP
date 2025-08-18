package com.fyp.avian_annotator.dto.response;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GeneratePresignedUploadUrlResponseDTO(
        @NotEmpty String uploadUrl, @NotNull UUID imageId) {
}
