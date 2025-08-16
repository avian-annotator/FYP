package com.fyp.avian_annotator.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dal.repository.UserRepository;
import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import com.fyp.avian_annotator.exception.UserNotFoundException;
import com.fyp.avian_annotator.service.MeService;
import com.fyp.avian_annotator.utils.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MeServiceImpl implements MeService {

  private final ObjectMapper mapper;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public UserResponseDTO getMe(Long id) {
    User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    return mapper.convertValue(user, UserResponseDTO.class);
  }

  @Override
  public User editMe(Long id, String userName, String password, UserRole role) {
    return userRepository
        .findById(id)
        .map(
            userToUpdate -> {
              com.fyp.avian_annotator.model.User userModel =
                  mapper.convertValue(userToUpdate, com.fyp.avian_annotator.model.User.class);
              userModel.update(userName, password, passwordEncoder, role);
              return userRepository.save(userModel.toEntity(userToUpdate));
            })
        .orElseThrow(() -> new UserNotFoundException(id));
  }

  @Override
  public void deleteMe(Long id) {
    userRepository.deleteById(id);
  }
}
