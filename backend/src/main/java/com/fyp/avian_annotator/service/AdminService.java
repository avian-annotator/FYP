package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import com.fyp.avian_annotator.utils.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
  UserResponseDTO createUser(String userName, String password);

  Page<UserResponseDTO> getAllUsers(Pageable pageable);

  UserResponseDTO editUser(Long id, String userName, String password, UserRole role);

  void deleteUser(Long id);
}
