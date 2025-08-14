package com.fyp.avian_annotator.dto.response;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record WorkspaceResponseDTO(@NotNull Long id, @NotEmpty String name) {}
