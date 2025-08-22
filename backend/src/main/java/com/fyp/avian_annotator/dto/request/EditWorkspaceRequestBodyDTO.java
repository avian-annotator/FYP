package com.fyp.avian_annotator.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record EditWorkspaceRequestBodyDTO(String name) {}
