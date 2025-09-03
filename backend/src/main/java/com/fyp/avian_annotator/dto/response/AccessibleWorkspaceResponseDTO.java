package com.fyp.avian_annotator.dto.response;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record AccessibleWorkspaceResponseDTO(
    @NotNull Long id, @NotEmpty String name, @NotEmpty String ownerUsername) {}
