package com.fyp.avian_annotator.dto.response;

import com.fyp.avian_annotator.utils.UserRole;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CurrentUserResponseDTO {

  private boolean authenticated;

  @NotBlank private String user;

  private UserRole role;
}
