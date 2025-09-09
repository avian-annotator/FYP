package com.fyp.avian_annotator.exception;

public class NotAllowedException extends RuntimeException {
  public NotAllowedException(String cannotRemoveOwnerFromWorkspace) {
    super("You don't have permissions");
  }
}
