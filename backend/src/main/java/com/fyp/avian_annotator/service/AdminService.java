package com.fyp.avian_annotator.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dal.repository.UserRepository;
import com.fyp.avian_annotator.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class AdminService {

    private final ObjectMapper mapper;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(String userName, String password) {
        String hashedPassword = passwordEncoder.encode(password);
        User user = User.builder()
                .username(userName)
                .passwordHash(hashedPassword)
                .build();
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User editUser(Long id, String userName, String password, String role) {

        return userRepository.findById(id)
                .map(user -> {
                    com.fyp.avian_annotator.model.User userModel = mapper.convertValue(user,
                            com.fyp.avian_annotator.model.User.class);

                    userModel.update(userName, password, passwordEncoder, role);

                    return userRepository.save(userModel.toEntity(user));
                })
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }


}

