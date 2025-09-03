package com.fyp.avian_annotator.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;

public record AnnotationRequestParamDTO(
    @JsonInclude(JsonInclude.Include.NON_NULL) Boolean includeAnnotations) {}
