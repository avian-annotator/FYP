package com.fyp.avian_annotator.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record CreateUserRequestBodyDTO(@NotEmpty String username, @NotEmpty String password) {}
