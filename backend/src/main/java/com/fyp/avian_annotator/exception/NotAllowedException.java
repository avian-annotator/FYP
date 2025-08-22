package com.fyp.avian_annotator.exception;

public class NotAllowedException extends RuntimeException {
  public NotAllowedException() {
    super("You don't have permissions");
  }
}
