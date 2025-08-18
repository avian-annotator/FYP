package com.fyp.avian_annotator.controller;

import com.fyp.avian_annotator.dto.request.*;
import com.fyp.avian_annotator.dto.response.*;
import com.fyp.avian_annotator.exception.BadRequestException;
import com.fyp.avian_annotator.exception.ImageUploadException;
import com.fyp.avian_annotator.exception.WorkspaceNotFoundException;
import com.fyp.avian_annotator.security.CustomUserDetails;
import com.fyp.avian_annotator.service.ImageService;
import com.fyp.avian_annotator.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RequestMapping("/api/workspaces")
@RestController
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;
    private final ImageService imageService;

    @PostMapping()
    public ResponseEntity<WorkspaceResponseDTO> createWorkspace(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateWorkspaceRequestBodyDTO body) {
        WorkspaceResponseDTO responseDTO =
                workspaceService.createUserWorkspace(userDetails.getId(), body.name());
        URI location =
                ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(responseDTO.id())
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
                workspaceService.editWorkspace(userDetails.getId(), workspaceId, request.name()));
    }

    @GetMapping
    public PageWrapper<AccessibleWorkspaceResponseDTO> getWorkspaces(
            @AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable) {
        return new PageWrapper<>(workspaceService.getWorkspace(userDetails.getId(), pageable));
    }

    @PostMapping("/{workspaceId}/users")
    public ResponseEntity<Void> addUserToWorkspace(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long workspaceId,
            @RequestBody @Valid AddUserToWorkspaceRequestBodyDTO body) {

        workspaceService.addUserToWorkspace(userDetails.getId(), workspaceId, body.userId());

        URI location =
                ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{userId}")
                        .buildAndExpand(body.userId())
                        .toUri();

        return ResponseEntity.created(location).build();
    }

    @DeleteMapping("/{workspaceId}/users/{userId}")
    public ResponseEntity<Void> removeUserFromWorkspace(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long workspaceId,
            @PathVariable Long userId) {

        workspaceService.removeUserFromWorkspace(userDetails.getId(), workspaceId, userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{workspaceId}/users")
    public ResponseEntity<PageWrapper<UserResponseDTO>> getUsersFromWorkspace(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long workspaceId,
            @ModelAttribute @Valid GetUsersFromWorkspaceRequestParamDTO param,
            Pageable pageable) {

        return ResponseEntity.ok(
                new PageWrapper<>(
                        workspaceService.getUsersFromWorkspace(
                                userDetails.getId(), workspaceId, param.excludeExisting(), pageable)));
    }

    @PostMapping("/{workspaceId}/images")
    public ResponseEntity<Void> uploadImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long workspaceId,
            @Valid @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            throw new BadRequestException("File must not be empty");
        }
        try {
            String imageId = imageService.uploadImage(
                    userDetails.getId(), workspaceId, file.getContentType(), file.getOriginalFilename(), file.getInputStream());
            URI location =
                    ServletUriComponentsBuilder.fromCurrentRequest()
                            .path("/{imageId}")
                            .buildAndExpand(imageId)
                            .toUri();
            return ResponseEntity.created(location).build();
        } catch (WorkspaceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new ImageUploadException(e.getMessage());
        }
    }

    @PatchMapping("/{workspaceId}/images/{imageId}")
    public ResponseEntity<EditImageDetailsResponseDTO> editImageDetails(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long workspaceId,
            @RequestBody @Valid EditImageRequestBodyDTO body,
            @PathVariable String imageId) {
        EditImageDetailsResponseDTO responseBody =
                imageService.editImageDetails(userDetails.getId(), workspaceId, body.fileName(), imageId);
        return ResponseEntity.ok(responseBody);
    }

    // Intended for getting an image by itself, especially if downloadable
    @GetMapping("/{workspaceId}/images/{imageId}")
    public ImageResponseDTO generatePresignedDownloadUrlForImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long workspaceId,
            @PathVariable String imageId,
            @ModelAttribute AnnotationRequestParamDTO requestParam) {
        return imageService.createDownloadPresignedUrlForImage(
                userDetails.getId(), workspaceId, imageId, requestParam.includeAnnotations());
    }

    // Intended for getting an image by itself, especially if downloadable
    @GetMapping("/{workspaceId}/images")
    public PageWrapper<ImageResponseDTO> generatePresignedDownloadUrlForImages(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long workspaceId,
            @ModelAttribute AnnotationRequestParamDTO requestParam,
            Pageable pageable) {
        return new PageWrapper<>(
                imageService.createDownloadPresignedUrlForImages(
                        userDetails.getId(), workspaceId, requestParam.includeAnnotations(), pageable));
    }

    @DeleteMapping("/{workspaceId}/images/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long workspaceId,
            @PathVariable String imageId) {
        imageService.deleteImage(userDetails.getId(), workspaceId, imageId);
        return ResponseEntity.noContent().build();
    }
}
