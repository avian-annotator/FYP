package com.fyp.avian_annotator.exception;

public class UnownedWorkspaceException extends RuntimeException {
  public UnownedWorkspaceException() {
    super("You do not have permission because you do not own this workspace.");
  }
}
