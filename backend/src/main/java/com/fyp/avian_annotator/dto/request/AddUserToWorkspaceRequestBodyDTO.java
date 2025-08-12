package com.fyp.avian_annotator.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddUserToWorkspaceRequestBodyDTO {
  @NotBlank String username;
}
