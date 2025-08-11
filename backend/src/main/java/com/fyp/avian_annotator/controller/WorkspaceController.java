package com.fyp.avian_annotator.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dto.request.CreateWorkspaceRequestBodyDTO;
import com.fyp.avian_annotator.dto.response.WorkspaceResponseDTO;
import com.fyp.avian_annotator.service.WorkspaceService;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
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
      @RequestBody @Valid CreateWorkspaceRequestBodyDTO request) {
    Workspace workspace =
        workspaceService.createUserWorkspace(userDetails.getUsername(), request.getName());
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
}
