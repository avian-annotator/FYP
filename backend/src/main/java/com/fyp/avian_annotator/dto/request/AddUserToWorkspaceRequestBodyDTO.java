package com.fyp.avian_annotator.dto.request;

import jakarta.validation.constraints.NotNull;

public record AddUserToWorkspaceRequestBodyDTO(@NotNull Long userId) {}
