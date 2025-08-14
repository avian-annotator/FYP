package com.fyp.avian_annotator.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AccessibleWorkspaceResponseDTO(
    @NotNull Long id, @NotNull String name, @NotBlank String ownerUsername) {}
