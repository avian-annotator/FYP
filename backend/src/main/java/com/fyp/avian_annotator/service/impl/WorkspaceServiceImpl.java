package com.fyp.avian_annotator.service.impl;

import com.fyp.avian_annotator.dal.entity.*;
import com.fyp.avian_annotator.dal.repository.ImageRepository;
import com.fyp.avian_annotator.dal.repository.UserRepository;
import com.fyp.avian_annotator.dal.repository.WorkspaceRepository;
import com.fyp.avian_annotator.dal.repository.WorkspaceUserRepository;
import com.fyp.avian_annotator.dto.response.AccessibleWorkspaceResponseDTO;
import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import com.fyp.avian_annotator.dto.response.WorkspaceResponseDTO;
import com.fyp.avian_annotator.exception.NotAllowedException;
import com.fyp.avian_annotator.exception.UnownedWorkspaceException;
import com.fyp.avian_annotator.exception.UserNotFoundException;
import com.fyp.avian_annotator.exception.WorkspaceNotFoundException;
import com.fyp.avian_annotator.service.S3Service;
import com.fyp.avian_annotator.service.WorkspaceService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {
  private final WorkspaceRepository workspaceRepository;
  private final WorkspaceUserRepository workspaceUserRepository;
  private final UserRepository userRepository;
  private final S3Service s3Service;
  private final ImageRepository imageRepository;

  @Override
  public WorkspaceResponseDTO createUserWorkspace(Long userId, String name) {
    User user =
        userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));

    Workspace newWorkspace = Workspace.builder().owner(user).name(name).build();
    // TODO: Send request to S3 to create a bucket, retrying if the generated name is already taken

    WorkspaceUser newWorkspaceUser = new WorkspaceUser(newWorkspace, user);
    newWorkspace.getWorkspaceUsers().add(newWorkspaceUser);
    workspaceRepository.save(newWorkspace);

    return convertToResponseDTO(newWorkspace);
  }

  @Transactional
  @Override
  public WorkspaceResponseDTO editWorkspace(Long ownerId, Long workspaceId, String newName) {

    Workspace workspace =
        workspaceRepository
            .findByIdAndOwnerId(workspaceId, ownerId)
            .orElseThrow(
                () -> new WorkspaceNotFoundException(workspaceId + " for owner " + ownerId));

    /*
    Hey Daniel, you ask, why not do request validation in the controller?
    This is for extensibility - if there are more fields to edit in the future,
    we must handle them in the service layer within the model, as some fields are optional.
    So we update the non-null values here.
     */
    if (newName != null && !newName.isEmpty()) {
      workspace.setName(newName);
    }
    workspaceRepository.save(workspace);
    return convertToResponseDTO(workspace);
  }

  @Transactional
  @Override
  public void deleteWorkspace(Long ownerId, Long workspaceId) {
    Workspace workspace =
        workspaceRepository
            .findByIdAndOwnerId(workspaceId, ownerId)
            .orElseThrow(() -> new WorkspaceNotFoundException(workspaceId));

    List<Image> images = imageRepository.findByWorkspaceId(workspace.getId());

    images.forEach(
        image -> s3Service.deleteObject(workspace.getBucketPrefix() + image.getBucketIdentifier()));

    workspaceRepository.delete(workspace);
  }

  @Override
  public Page<AccessibleWorkspaceResponseDTO> getWorkspace(Long userId, Pageable pageable) {
    var user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));

    return workspaceRepository.findAccessibleWorkspaces(user.getId(), pageable);
  }

  // Need to look into spring jpa here - doing it via sql doesn't require this many throws
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

  @Transactional
  @Override
  public void removeUserFromWorkspace(Long sessionUserId, Long workspaceId, Long toRemoveUserId) {
    Workspace workspace = getWorkspaceOrThrow(workspaceId);
    User sessionUser = getUserOrThrow(sessionUserId);

    validateOwnership(workspace, sessionUser);
    try {
      workspaceUserRepository.deleteById(new WorkspaceUserId(workspaceId, toRemoveUserId));
    } catch (EmptyResultDataAccessException e) {
      throw new UserNotFoundException(toRemoveUserId);
    }
  }

  @Override
  public Page<UserResponseDTO> getUsersFromWorkspace(
      Long sessionUserId, Long workspaceId, Boolean excludeExisting, Pageable pageable) {
    Workspace workspace = getWorkspaceOrThrow(workspaceId);
    User sessionUser = getUserOrThrow(sessionUserId);

    validateOwnership(workspace, sessionUser);
    if (excludeExisting != null && excludeExisting) {
      return workspaceUserRepository.findUsersNotInWorkspace(workspaceId, pageable);
    }
    return workspaceUserRepository.findUsersOfWorkspace(workspaceId, pageable);
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
        workspaceUserRepository.existsById(new WorkspaceUserId(workspaceId, toAddUser.getId()));
    if (alreadyAssociated) {
      throw new NotAllowedException();
    }
  }

  private WorkspaceResponseDTO convertToResponseDTO(Workspace workspace) {
    return new WorkspaceResponseDTO(workspace.getId(), workspace.getName());
  }
}
