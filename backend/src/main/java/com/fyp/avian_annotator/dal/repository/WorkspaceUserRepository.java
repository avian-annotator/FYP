package com.fyp.avian_annotator.dal.repository;

import com.fyp.avian_annotator.dal.entity.WorkspaceUser;
import com.fyp.avian_annotator.dal.entity.WorkspaceUserId;
import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WorkspaceUserRepository extends JpaRepository<WorkspaceUser, WorkspaceUserId> {
  @Query(
      """
    SELECT new com.fyp.avian_annotator.dto.response.UserResponseDTO(u.id, u.username, u.role, u.createdAt)
    FROM WorkspaceUser wu
    JOIN wu.user u
    WHERE wu.workspace.id = :workspaceId
""")
  Page<UserResponseDTO> findUsersOfWorkspace(Long workspaceId);

  @Query(
      """
    SELECT new com.fyp.avian_annotator.dto.response.UserResponseDTO(u.id, u.username, u.role, u.createdAt)
    FROM WorkspaceUser wu
    JOIN wu.user u
    WHERE wu.workspace.id != :workspaceId
""")
  Page<UserResponseDTO> findUsersNotInWorkspace(Long workspaceId);
}
