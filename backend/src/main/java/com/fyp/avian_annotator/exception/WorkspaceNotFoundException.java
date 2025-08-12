package com.fyp.avian_annotator.exception;

public class WorkspaceNotFoundException extends RuntimeException {
  public WorkspaceNotFoundException(Long id) {
    super("Workspace not found with id: " + id);
  }

  public WorkspaceNotFoundException(String name) {
    super("Workspace not found with name: " + name);
  }
}
