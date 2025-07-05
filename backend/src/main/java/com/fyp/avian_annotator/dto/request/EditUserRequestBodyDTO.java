package com.fyp.avian_annotator.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class EditUserRequestBodyDTO {

    private String username;

    private String password;

    private String role;
}
