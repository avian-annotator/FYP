package com.fyp.avian_annotator.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateWorkspaceRequestBodyDTO {

    @NotBlank
    public String name;
}
