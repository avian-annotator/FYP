package com.fyp.avian_annotator.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AccessibleWorkspaceResponseDTO {
  private Long id;
  private String name;
  private String ownerUsername;
}
