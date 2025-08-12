package com.fyp.avian_annotator.model;

import com.fyp.avian_annotator.utils.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;

@AllArgsConstructor
@Getter
@Setter
public class User {

  private String username;
  private String passwordHash;
  private UserRole role;

  public void update(
      String username, String passwordHash, PasswordEncoder passwordEncoder, UserRole role) {
    this.username = username;
    this.role = role;
    this.passwordHash = (passwordHash == null) ? null : passwordEncoder.encode(passwordHash);
  }

  public com.fyp.avian_annotator.dal.entity.User toEntity(
      com.fyp.avian_annotator.dal.entity.User existingEntity) {
    if (this.username != null) existingEntity.setUsername(this.username);
    if (this.role != null) existingEntity.setRole(this.role);
    if (this.passwordHash != null) existingEntity.setPasswordHash(this.passwordHash);
    return existingEntity;
  }
}
