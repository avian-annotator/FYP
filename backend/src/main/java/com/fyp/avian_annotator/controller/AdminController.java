package com.fyp.avian_annotator.controller;

import com.fyp.avian_annotator.dto.request.CreateUserRequestBodyDTO;
import com.fyp.avian_annotator.dto.request.EditUserRequestBodyDTO;
import com.fyp.avian_annotator.dto.response.PageWrapper;
import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import com.fyp.avian_annotator.service.AdminService;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RequestMapping("/api/admin")
@RequiredArgsConstructor
@RestController
public class AdminController {

  private final AdminService adminService;

  @PostMapping("/users")
  public ResponseEntity<UserResponseDTO> createNewUser(
      @RequestBody @Valid CreateUserRequestBodyDTO request) {

    var createdUser = adminService.createUser(request.username(), request.password());

    URI location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(createdUser.id())
            .toUri();

    return ResponseEntity.created(location).body(createdUser);
  }

  @GetMapping("/users")
  public ResponseEntity<PageWrapper<UserResponseDTO>> getAllUsers(Pageable pageable) {

    return ResponseEntity.ok(new PageWrapper<UserResponseDTO>(adminService.getAllUsers(pageable)));
  }

  @PatchMapping("/users/{id}")
  public ResponseEntity<UserResponseDTO> editUser(
      @PathVariable Long id, @RequestBody @Valid EditUserRequestBodyDTO request) {

    var editedUserDTO =
        adminService.editUser(id, request.username(), request.password(), request.role());

    return ResponseEntity.ok(editedUserDTO);
  }

  @DeleteMapping("/users/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    adminService.deleteUser(id);

    return ResponseEntity.noContent().build();
  }
}
