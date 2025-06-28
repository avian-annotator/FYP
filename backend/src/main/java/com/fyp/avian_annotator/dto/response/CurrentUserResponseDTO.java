package com.fyp.avian_annotator.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CurrentUserResponseDTO {
    private boolean authenticated;
    private String user;
}
