package com.fyp.avian_annotator.config;

import com.google.googlejavaformat.java.Formatter;
import com.google.googlejavaformat.java.FormatterException;

public class CodeFormatter {
    public static String format(String source) throws FormatterException {
        return new Formatter().formatSource(source);
    }
}
