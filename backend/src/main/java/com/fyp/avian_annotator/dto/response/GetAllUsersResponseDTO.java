package com.fyp.avian_annotator.dto.response;

import com.fyp.avian_annotator.utils.UserRole;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetAllUsersResponseDTO {

  @NotEmpty private Long id;

  @NotNull private String username;

  @NotEmpty private UserRole role;

  @NotEmpty private OffsetDateTime createdAt;
}
