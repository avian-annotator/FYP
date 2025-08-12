package com.fyp.avian_annotator.dto.request;

import com.fyp.avian_annotator.utils.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class EditUserRequestBodyDTO {

  private String username;

  private String password;

  private UserRole role;
}
