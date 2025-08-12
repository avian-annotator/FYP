package com.fyp.avian_annotator.dto.response;

import com.fyp.avian_annotator.utils.UserRole;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDTO {

  private Long id;

  private String username;

  private UserRole role;

  private OffsetDateTime createdAt;
}
