package com.fyp.avian_annotator.dto.response;

import com.fyp.avian_annotator.utils.UserRole;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CurrentUserResponseDTO(
    @NotNull Boolean authenticated,
    @NotNull Long id,
    @NotEmpty String username,
    @NotNull UserRole role) {}
