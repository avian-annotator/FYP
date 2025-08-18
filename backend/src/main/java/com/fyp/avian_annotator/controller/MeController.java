package com.fyp.avian_annotator.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dto.request.EditUserRequestBodyDTO;
import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import com.fyp.avian_annotator.security.CustomUserDetails;
import com.fyp.avian_annotator.service.MeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/me")
@RequiredArgsConstructor
@RestController
public class MeController {

  private final MeService meService;
  private final ObjectMapper mapper;

  @GetMapping
  public ResponseEntity<UserResponseDTO> getMe(
      @AuthenticationPrincipal CustomUserDetails userDetails) {
    return ResponseEntity.ok(meService.getMe(userDetails.getId()));
  }

  @PatchMapping
  public ResponseEntity<UserResponseDTO> editMe(
      @RequestBody @Valid EditUserRequestBodyDTO request,
      @AuthenticationPrincipal CustomUserDetails userDetails) {

    User editedMe =
        meService.editMe(
            userDetails.getId(), request.username(), request.password(), request.role());

    UserResponseDTO responseDTO = mapper.convertValue(editedMe, UserResponseDTO.class);
    return ResponseEntity.ok(responseDTO);
  }

  @DeleteMapping
  public ResponseEntity<Void> deleteMe(@AuthenticationPrincipal CustomUserDetails userDetails) {
    meService.deleteMe(userDetails.getId());
    return ResponseEntity.noContent().build();
  }
}
