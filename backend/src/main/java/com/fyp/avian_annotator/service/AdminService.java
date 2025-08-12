package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.utils.UserRole;
import java.util.List;

public interface AdminService {
  User createUser(String userName, String password);

  List<User> getAllUsers();

  User editUser(Long id, String userName, String password, UserRole role);

  void deleteUser(Long id);
}
