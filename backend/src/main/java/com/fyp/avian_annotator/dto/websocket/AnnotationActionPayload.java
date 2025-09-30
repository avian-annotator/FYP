package com.fyp.avian_annotator.dto.websocket;

public record AnnotationActionPayload(String actionType, Long userId, String action) {}
