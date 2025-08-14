package com.fyp.avian_annotator.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dal.repository.UserRepository;
import com.fyp.avian_annotator.exception.BadRequestException;
import com.fyp.avian_annotator.exception.UserNotFoundException;
import com.fyp.avian_annotator.service.AdminService;
import com.fyp.avian_annotator.utils.UserRole;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
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
  public User createUser(String userName, String password) {
    if (userRepository.findByUsername(userName).isPresent()) {
      throw new BadRequestException("Username already exists");
    }
    String hashedPassword = passwordEncoder.encode(password);
    User user = User.builder().username(userName).passwordHash(hashedPassword).build();
    return userRepository.save(user);
  }

  @Override
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  @Override
  public User editUser(Long id, String userName, String password, UserRole role) {

    User userEntity = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));

    if (userName != null
        && userRepository.findByUsername(userName).filter(u -> !u.getId().equals(id)).isPresent()) {
      throw new BadRequestException("Username already exists");
    }

    com.fyp.avian_annotator.model.User userModel =
        mapper.convertValue(userEntity, com.fyp.avian_annotator.model.User.class);

    userModel.update(userName, password, passwordEncoder, role);

    User updatedEntity = userModel.toEntity(userEntity);

    return userRepository.save(updatedEntity);
  }

  @Transactional
  @Override
  public void deleteUser(Long id) {
    try {
      userRepository.deleteById(id);
    } catch (EmptyResultDataAccessException e) {
      throw new BadRequestException("User with ID " + id + " does not exist.");
    }
  }
}
