package com.fyp.avian_annotator.dal.repository;

import com.fyp.avian_annotator.dal.entity.User;
import java.util.Optional;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  @NonNull
  Optional<User> findById(Long id);
}
