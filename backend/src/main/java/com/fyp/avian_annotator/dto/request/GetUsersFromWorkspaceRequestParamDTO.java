package com.fyp.avian_annotator.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;

public record GetUsersFromWorkspaceRequestParamDTO(
    @JsonInclude(JsonInclude.Include.NON_NULL) Boolean excludeExisting) {}
