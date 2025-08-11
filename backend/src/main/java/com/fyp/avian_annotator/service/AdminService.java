package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dal.entity.User;
import java.util.List;

public interface AdminService {
  User createUser(String userName, String password);

  List<User> getAllUsers();

  User editUser(Long id, String userName, String password, String role);

  void deleteUser(Long id);
}
