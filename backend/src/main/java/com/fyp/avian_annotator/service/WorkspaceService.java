package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dal.repository.UserRepository;
import com.fyp.avian_annotator.dal.repository.WorkspaceRepository;
import com.fyp.avian_annotator.exception.UserNotFoundException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

  private final WorkspaceRepository workspaceRepository;
  private final UserRepository userRepository;

  public Workspace createUserWorkspace(String username, String name) {
    Optional<User> user = userRepository.findByUsername(username);
    if (user.isPresent()) {
      Workspace newWorkspace = Workspace.builder().owner(user.get()).name(name).build();
      workspaceRepository.save(newWorkspace);
      return newWorkspace;
    }

    throw new UserNotFoundException(username);
  }

  public void deleteWorkspace(String username, Long id) {
    Optional<User> user = userRepository.findByUsername(username);
    if (user.isPresent()) {
      workspaceRepository
          .findByIdAndOwnerUsername(id, username)
          .ifPresent(workspaceRepository::delete);
    }
  }
}
