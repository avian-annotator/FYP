package com.fyp.avian_annotator.controller;

import com.fyp.avian_annotator.dto.request.AddUserToWorkspaceRequestBodyDTO;
import com.fyp.avian_annotator.dto.request.CreateWorkspaceRequestBodyDTO;
import com.fyp.avian_annotator.dto.request.EditWorkspaceRequestBodyDTO;
import com.fyp.avian_annotator.dto.response.AccessibleWorkspaceResponseDTO;
import com.fyp.avian_annotator.dto.response.WorkspaceResponseDTO;
import com.fyp.avian_annotator.security.CustomUserDetails;
import com.fyp.avian_annotator.service.WorkspaceService;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RequestMapping("/api/workspaces")
@RestController
@RequiredArgsConstructor
public class WorkspaceController {

  private final WorkspaceService workspaceService;

  @PostMapping()
  public ResponseEntity<WorkspaceResponseDTO> createWorkspace(
      @AuthenticationPrincipal CustomUserDetails userDetails,
      @RequestBody @Valid CreateWorkspaceRequestBodyDTO body) {
    WorkspaceResponseDTO responseDTO =
        workspaceService.createUserWorkspace(userDetails.getId(), body.getName());
    URI location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(responseDTO.getId())
            .toUri();

    return ResponseEntity.created(location).body(responseDTO);
  }

  @DeleteMapping("/{workspaceId}")
  public ResponseEntity<Void> deleteWorkspace(
      @AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long workspaceId) {
    workspaceService.deleteWorkspace(userDetails.getId(), workspaceId);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/{workspaceId}")
  public ResponseEntity<WorkspaceResponseDTO> editWorkspace(
      @AuthenticationPrincipal CustomUserDetails userDetails,
      @PathVariable Long workspaceId,
      @RequestBody @Valid EditWorkspaceRequestBodyDTO request) {

    return ResponseEntity.ok(
        workspaceService.editWorkspace(userDetails.getId(), workspaceId, request.getName()));
  }

  @GetMapping
  public Page<AccessibleWorkspaceResponseDTO> getWorkspaces(
      @AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable) {
    return workspaceService.getWorkspace(userDetails.getId(), pageable);
  }

  @PostMapping("/{workspaceId}/users")
  public ResponseEntity<Void> addUserToWorkspace(
      @AuthenticationPrincipal CustomUserDetails userDetails,
      @PathVariable Long workspaceId,
      @RequestBody @Valid AddUserToWorkspaceRequestBodyDTO body) {

    workspaceService.addUserToWorkspace(userDetails.getId(), workspaceId, body.getUserId());

    URI location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{userId}")
            .buildAndExpand(body.getUserId())
            .toUri();

    return ResponseEntity.created(location).build();
  }
}
