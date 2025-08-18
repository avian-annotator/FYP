package com.fyp.avian_annotator.test;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RequestParamDTO {
    private String foo;
    @NotNull
    private String bar;
}
