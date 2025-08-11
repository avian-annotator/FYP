package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dal.entity.Workspace;

public interface WorkspaceService {
  Workspace createUserWorkspace(String username, String name);

  void deleteWorkspace(String username, Long id);
}
