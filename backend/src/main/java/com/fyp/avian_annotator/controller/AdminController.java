package com.fyp.avian_annotator.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dto.request.CreateUserRequestBodyDTO;
import com.fyp.avian_annotator.dto.request.EditUserRequestBodyDTO;
import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import com.fyp.avian_annotator.service.AdminService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RequestMapping("/api/admin")
@RequiredArgsConstructor
@RestController
public class AdminController {

  private final AdminService adminService;

  private final ObjectMapper mapper;

  @PostMapping("/users")
  public ResponseEntity<UserResponseDTO> createNewUser(
      @RequestBody @Valid CreateUserRequestBodyDTO request) {

    User createdUser = adminService.createUser(request.getUsername(), request.getPassword());

    URI location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(createdUser.getId())
            .toUri();

    UserResponseDTO responseDTO = mapper.convertValue(createdUser, UserResponseDTO.class);

    return ResponseEntity.created(location).body(responseDTO);
  }

  @GetMapping("/users")
  public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

    List<User> users = adminService.getAllUsers();

    return ResponseEntity.ok(
        users.stream().map(user -> mapper.convertValue(user, UserResponseDTO.class)).toList());
  }

  @PatchMapping("/users/{id}")
  public ResponseEntity<UserResponseDTO> editUser(
      @PathVariable Long id, @RequestBody @Valid EditUserRequestBodyDTO request) {

    User editedUser =
        adminService.editUser(id, request.getUsername(), request.getPassword(), request.getRole());

    UserResponseDTO responseDTO = mapper.convertValue(editedUser, UserResponseDTO.class);

    return ResponseEntity.ok(responseDTO);
  }

  @DeleteMapping("/users/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    adminService.deleteUser(id);

    return ResponseEntity.noContent().build();
  }
}
