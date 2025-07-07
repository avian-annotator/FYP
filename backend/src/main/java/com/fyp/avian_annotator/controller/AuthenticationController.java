package com.fyp.avian_annotator.controller;

import com.fyp.avian_annotator.dto.response.CurrentUserResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {

    @GetMapping("/current_user")
    public ResponseEntity<CurrentUserResponseDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.ok(new CurrentUserResponseDTO(false, null, null));
        }
        // We know that by the DB definition, that every user has 1 role. So this is safe for now.
        // Obviously, this will need to be changed if we change to scopes/authorities (which is generally the
        // recommended approach for larger, long term projects).
        return ResponseEntity.ok(new CurrentUserResponseDTO(true, userDetails.getUsername(), Objects.requireNonNull(userDetails.getAuthorities().stream().findFirst().orElse(null)).toString()));
    }

}
