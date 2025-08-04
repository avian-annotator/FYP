package com.fyp.avian_annotator.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class WorkspaceResponseDTO {
  @NotNull private Long id;

  @NotBlank private String name;
}
