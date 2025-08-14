package com.fyp.avian_annotator.controller;

import com.fyp.avian_annotator.dto.response.CurrentUserResponseDTO;
import com.fyp.avian_annotator.security.CustomUserDetails;
import com.fyp.avian_annotator.utils.UserRole;
import java.util.Objects;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {

  @GetMapping("/current_user")
  public ResponseEntity<CurrentUserResponseDTO> getCurrentUser(
      @AuthenticationPrincipal CustomUserDetails userDetails) throws IllegalAccessException {
    if (userDetails == null) {
      throw new IllegalAccessException();
    }
    // We know that by the DB definition, that every user has 1 role. So this is safe for now.
    // Obviously, this will need to be changed if we change to scopes/authorities (which is
    // generally the
    // recommended approach for larger, long term projects)
    return ResponseEntity.ok(
        new CurrentUserResponseDTO(
            true,
            userDetails.getId(),
            userDetails.getUsername(),
            UserRole.valueOf(
                Objects.requireNonNull(
                        userDetails.getAuthorities().stream().findFirst().orElse(null))
                    .toString()
                    .replaceFirst("^ROLE_", ""))));
  }
}
