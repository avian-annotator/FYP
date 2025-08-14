package com.fyp.avian_annotator.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record CreateWorkspaceRequestBodyDTO(@NotEmpty String name) {}
