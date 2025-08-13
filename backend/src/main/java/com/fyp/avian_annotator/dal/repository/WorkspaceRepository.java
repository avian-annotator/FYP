package com.fyp.avian_annotator.dal.repository;

import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dto.response.AccessibleWorkspaceResponseDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
  Optional<Workspace> findByIdAndOwnerId(Long id, Long ownerId);

  Optional<Workspace> findByOwnerIdAndName(Long ownerId, String name);

  @Query(
      """
  SELECT new com.fyp.avian_annotator.dto.response.AccessibleWorkspaceResponseDTO(w.id, w.name, u.username)
  FROM WorkspaceUser wu
  JOIN wu.workspace w
  JOIN wu.user u
  WHERE u.id = :userId
""")
  Page<AccessibleWorkspaceResponseDTO> findAccessibleWorkspaces(
      @Param("userId") Long userId, Pageable pageable);

  Optional<Workspace> findByName(String name);
}
