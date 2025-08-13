package com.fyp.avian_annotator.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class AddUserToWorkspaceRequestBodyDTO {
  @NotEmpty Long userId;
}
