package com.fyp.avian_annotator.dto.request;

import com.fyp.avian_annotator.utils.UserRole;

public record EditUserRequestBodyDTO(String username, String password, UserRole role) {}
