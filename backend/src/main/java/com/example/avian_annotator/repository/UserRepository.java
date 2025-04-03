package com.example.avian_annotator.repository;

import com.example.avian_annotator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
