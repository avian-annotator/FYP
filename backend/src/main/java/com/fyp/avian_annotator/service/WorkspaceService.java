package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dto.response.AccessibleWorkspaceResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WorkspaceService {
  Workspace createUserWorkspace(String username, String name);

  void deleteWorkspace(String username, Long id);

  Page<AccessibleWorkspaceResponseDTO> getWorkspace(String sessionUserUsername, Pageable pageable);

  Long addUserToWorkspace(String sessionUserUsername, Long workspaceId, String toAddUserUsername);
}
