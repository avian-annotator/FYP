package com.fyp.avian_annotator.service.impl;

import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dal.entity.WorkspaceUser;
import com.fyp.avian_annotator.dal.repository.UserRepository;
import com.fyp.avian_annotator.dal.repository.WorkspaceRepository;
import com.fyp.avian_annotator.dal.repository.WorkspaceUserRepository;
import com.fyp.avian_annotator.dto.response.AccessibleWorkspaceResponseDTO;
import com.fyp.avian_annotator.exception.UserNotFoundException;
import com.fyp.avian_annotator.service.WorkspaceService;
import jakarta.transaction.Transactional;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {
  private final WorkspaceRepository workspaceRepository;
  private final WorkspaceUserRepository workspaceUserRepository;
  private final UserRepository userRepository;

  @Override
  public Workspace createUserWorkspace(String username, String name) {
    Optional<User> user = userRepository.findByUsername(username);
    if (user.isPresent()) {
      Workspace newWorkspace = Workspace.builder().owner(user.get()).name(name).build();

      WorkspaceUser newWorkspaceUser = new WorkspaceUser(newWorkspace, user.get());
      newWorkspace.getWorkspaceUsers().add(newWorkspaceUser);
      workspaceRepository.save(newWorkspace);
      return newWorkspace;
    }
    throw new UserNotFoundException(username);
  }

  @Transactional
  @Override
  public void deleteWorkspace(String username, Long id) {
    workspaceRepository
        .findByIdAndOwnerUsername(id, username)
        .ifPresent(workspaceRepository::delete);
  }

  @Override
  public Page<AccessibleWorkspaceResponseDTO> getWorkspace(String username, Pageable pageable) {
    var user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException(username));

    return workspaceRepository.findAccessibleWorkspaces(user.getId(), pageable);
  }
}
