package com.fyp.avian_annotator.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fyp.avian_annotator.utils.UserRole;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record EditUserRequestBodyDTO(String username, String password, UserRole role) {}
