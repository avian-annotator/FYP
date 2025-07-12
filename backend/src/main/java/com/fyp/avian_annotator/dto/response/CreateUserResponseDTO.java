package com.fyp.avian_annotator.dto.response;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateUserResponseDTO {

  @NotEmpty private Long id;

  @NotNull private String username;

  @NotEmpty private String role;

  @NotEmpty private OffsetDateTime createdAt;
}
