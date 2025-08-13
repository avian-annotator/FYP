package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dto.response.AccessibleWorkspaceResponseDTO;
import com.fyp.avian_annotator.dto.response.WorkspaceResponseDTO;
import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WorkspaceService {
  WorkspaceResponseDTO createUserWorkspace(Long userId, String name);

  void deleteWorkspace(Long userId, Long id);

  WorkspaceResponseDTO editWorkspace(Long userId, Long workspaceId, String newName);

  Page<AccessibleWorkspaceResponseDTO> getWorkspace(Long userId, Pageable pageable);

  void addUserToWorkspace(Long sessionUserId, Long workspaceId, Long toAddUserId);

  void removeUserFromWorkspace(Long sessionUserId, Long workspaceId, Long toAddUserId);

  Page<UserResponseDTO> getUsersFromWorkspace(
      Long sessionUserId, Long workspaceId, Boolean inverse, Pageable pageable);
}
