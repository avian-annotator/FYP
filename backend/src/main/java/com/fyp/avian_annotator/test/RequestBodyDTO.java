package com.fyp.avian_annotator.test;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RequestBodyDTO {
    @NotNull
    private String foo;
    private String bar;
    @NotNull
    private Integer baz;
}
