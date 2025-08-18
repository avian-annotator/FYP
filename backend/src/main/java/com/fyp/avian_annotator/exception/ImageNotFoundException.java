package com.fyp.avian_annotator.exception;

public class ImageNotFoundException extends RuntimeException {
    public ImageNotFoundException(String imageId) {
        super("image not found with UUID of " + imageId);
    }
}
