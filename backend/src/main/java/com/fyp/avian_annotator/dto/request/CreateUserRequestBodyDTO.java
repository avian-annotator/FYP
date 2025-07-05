package com.fyp.avian_annotator.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class CreateUserRequestBodyDTO {

    @NotEmpty
    private String username;

    @NotEmpty
    private String password;
}
