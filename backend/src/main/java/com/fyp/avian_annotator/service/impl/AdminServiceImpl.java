package com.fyp.avian_annotator.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dal.repository.UserRepository;
import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import com.fyp.avian_annotator.exception.BadRequestException;
import com.fyp.avian_annotator.exception.UserNotFoundException;
import com.fyp.avian_annotator.service.AdminService;
import com.fyp.avian_annotator.utils.UserRole;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AdminServiceImpl implements AdminService {

  private final ObjectMapper mapper;

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Transactional
  @Override
  public UserResponseDTO createUser(String userName, String password) {
    if (userRepository.findByUsername(userName).isPresent()) {
      throw new BadRequestException("Username already exists");
    }
    String hashedPassword = passwordEncoder.encode(password);
    User user = User.builder().username(userName).passwordHash(hashedPassword).build();

    return mapper.convertValue(userRepository.save(user), UserResponseDTO.class);
  }

  @Override
  public Page<UserResponseDTO> getAllUsers(Pageable pageable) {
    return userRepository
        .findAll(pageable)
        .map(user -> mapper.convertValue(user, UserResponseDTO.class));
  }

  @Override
  public UserResponseDTO editUser(Long id, String userName, String password, UserRole role) {

    User userEntity = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));

    if (userName != null
        && userRepository.findByUsername(userName).filter(u -> !u.getId().equals(id)).isPresent()) {
      throw new BadRequestException("Username already exists");
    }

    com.fyp.avian_annotator.model.User userModel =
        mapper.convertValue(userEntity, com.fyp.avian_annotator.model.User.class);

    userModel.update(userName, password, passwordEncoder, role);

    User updatedEntity = userModel.toEntity(userEntity);

    return mapper.convertValue(userRepository.save(updatedEntity), UserResponseDTO.class);
  }

  @Transactional
  @Override
  public void deleteUser(Long id) {
    // TODO: delete the buckets items, and then the bucket itself
    try {
      userRepository.deleteById(id);
    } catch (EmptyResultDataAccessException e) {
      throw new UserNotFoundException(id);
    }
  }
}
