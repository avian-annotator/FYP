package com.fyp.avian_annotator.dal.repository;

import com.fyp.avian_annotator.dal.entity.WorkspaceUser;
import com.fyp.avian_annotator.dal.entity.WorkspaceUserId;
import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
  Page<UserResponseDTO> findUsersOfWorkspace(Long workspaceId, Pageable pageable);

  @Query(
      """
    SELECT new com.fyp.avian_annotator.dto.response.UserResponseDTO(u.id, u.username, u.role, u.createdAt)
    FROM User u
    LEFT JOIN WorkspaceUser wu ON wu.user = u AND wu.workspace.id = :workspaceId
    WHERE wu.id IS NULL
""")
  Page<UserResponseDTO> findUsersNotInWorkspace(Long workspaceId, Pageable pageable);
}
