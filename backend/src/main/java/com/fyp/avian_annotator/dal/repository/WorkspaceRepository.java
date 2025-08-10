package com.fyp.avian_annotator.dal.repository;

import com.fyp.avian_annotator.dal.entity.Workspace;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
  Optional<Workspace> findByIdAndOwnerUsername(Long id, String username);
}
