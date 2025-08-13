package com.fyp.avian_annotator.service.impl;

import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dal.entity.WorkspaceUser;
import com.fyp.avian_annotator.dal.entity.WorkspaceUserId;
import com.fyp.avian_annotator.dal.repository.UserRepository;
import com.fyp.avian_annotator.dal.repository.WorkspaceRepository;
import com.fyp.avian_annotator.dal.repository.WorkspaceUserRepository;
import com.fyp.avian_annotator.dto.response.AccessibleWorkspaceResponseDTO;
import com.fyp.avian_annotator.exception.BadRequestException;
import com.fyp.avian_annotator.exception.UnownedWorkspaceException;
import com.fyp.avian_annotator.exception.UserNotFoundException;
import com.fyp.avian_annotator.exception.WorkspaceNotFoundException;
import com.fyp.avian_annotator.service.WorkspaceService;
import jakarta.transaction.Transactional;
import java.util.Objects;
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
  public Workspace createUserWorkspace(Long userId, String name) {
    Optional<User> user = userRepository.findById(userId);
    if (user.isPresent()) {
      Workspace newWorkspace = Workspace.builder().owner(user.get()).name(name).build();

      WorkspaceUser newWorkspaceUser = new WorkspaceUser(newWorkspace, user.get());
      newWorkspace.getWorkspaceUsers().add(newWorkspaceUser);
      workspaceRepository.save(newWorkspace);
      return newWorkspace;
    }
    throw new UserNotFoundException(userId);
  }

  @Transactional
  @Override
  public void deleteWorkspace(Long ownerId, Long workspaceId) {
    workspaceRepository
        .findByIdAndOwnerId(workspaceId, ownerId)
        .ifPresent(workspaceRepository::delete);
  }

  @Override
  public Page<AccessibleWorkspaceResponseDTO> getWorkspace(Long userId, Pageable pageable) {
    var user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));

    return workspaceRepository.findAccessibleWorkspaces(user.getId(), pageable);
  }

  @Transactional
  @Override
  public void addUserToWorkspace(Long sessionUserId, Long workspaceId, Long toAddUserId) {
    Workspace workspace = getWorkspaceOrThrow(workspaceId);
    User sessionUser = getUserOrThrow(sessionUserId);
    User toAddUser = getUserOrThrow(toAddUserId);

    validateOwnership(workspace, sessionUser);
    checkUserNotAlreadyInWorkspace(workspaceId, toAddUser);

    WorkspaceUser workspaceUser = new WorkspaceUser(workspace, toAddUser);
    workspaceUserRepository.save(workspaceUser);
  }

  private Workspace getWorkspaceOrThrow(Long workspaceId) {
    return workspaceRepository
        .findById(workspaceId)
        .orElseThrow(() -> new WorkspaceNotFoundException(workspaceId));
  }

  private User getUserOrThrow(Long userId) {
    return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
  }

  private void validateOwnership(Workspace workspace, User user) {
    if (!Objects.equals(workspace.getOwner().getId(), user.getId())) {
      throw new UnownedWorkspaceException();
    }
  }

  private void checkUserNotAlreadyInWorkspace(Long workspaceId, User toAddUser) {
    boolean alreadyAssociated =
        workspaceUserRepository
            .findById(new WorkspaceUserId(workspaceId, toAddUser.getId()))
            .isPresent();
    if (alreadyAssociated) {
      throw new BadRequestException("User is already in the workspace");
    }
  }
}
