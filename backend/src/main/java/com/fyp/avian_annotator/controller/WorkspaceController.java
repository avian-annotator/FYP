package com.fyp.avian_annotator.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dto.request.AddUserToWorkspaceRequestBodyDTO;
import com.fyp.avian_annotator.dto.request.CreateWorkspaceRequestBodyDTO;
import com.fyp.avian_annotator.dto.response.AccessibleWorkspaceResponseDTO;
import com.fyp.avian_annotator.dto.response.WorkspaceResponseDTO;
import com.fyp.avian_annotator.service.WorkspaceService;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RequestMapping("/api/workspaces")
@RestController
@RequiredArgsConstructor
public class WorkspaceController {

  private final WorkspaceService workspaceService;
  private final ObjectMapper mapper;

  @PostMapping()
  public ResponseEntity<WorkspaceResponseDTO> createWorkspace(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestBody @Valid CreateWorkspaceRequestBodyDTO body) {
    Workspace workspace =
        workspaceService.createUserWorkspace(userDetails.getUsername(), body.getName());
    URI location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(workspace.getId())
            .toUri();

    WorkspaceResponseDTO responseDTO = mapper.convertValue(workspace, WorkspaceResponseDTO.class);
    return ResponseEntity.created(location).body(responseDTO);
  }

  @DeleteMapping("/{workspaceId}")
  public ResponseEntity<Void> deleteWorkspace(
      @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long workspaceId) {
    workspaceService.deleteWorkspace(userDetails.getUsername(), workspaceId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public Page<AccessibleWorkspaceResponseDTO> getWorkspaces(
      @AuthenticationPrincipal UserDetails userDetails, Pageable pageable) {
    return workspaceService.getWorkspace(userDetails.getUsername(), pageable);
  }

  @PostMapping("/{workspaceId}/users")
  public ResponseEntity<Void> addUserToWorkspace(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Long workspaceId,
      @RequestBody @Valid AddUserToWorkspaceRequestBodyDTO body) {

    Long toAddUserId =
        workspaceService.addUserToWorkspace(
            userDetails.getUsername(), workspaceId, body.getUsername());

    URI location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{userId}")
            .buildAndExpand(toAddUserId)
            .toUri();

    return ResponseEntity.created(location).build();
  }
}
