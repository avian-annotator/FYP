package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dto.response.AccessibleWorkspaceResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WorkspaceService {
  Workspace createUserWorkspace(Long userId, String name);

  void deleteWorkspace(Long userId, Long id);

  Page<AccessibleWorkspaceResponseDTO> getWorkspace(Long userId, Pageable pageable);

  void addUserToWorkspace(Long sessionUserId, Long workspaceId, Long toAddUserId);
}
