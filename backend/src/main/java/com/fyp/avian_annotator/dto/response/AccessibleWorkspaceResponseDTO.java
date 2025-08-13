package com.fyp.avian_annotator.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AccessibleWorkspaceResponseDTO {
  @NotNull private Long id;
  @NotNull private String name;
  @NotBlank private String ownerUsername;
}
