package com.fyp.avian_annotator.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RemoveUserFromWorkspaceRequestBodyDTO {
  @NotNull Long userId;
}
