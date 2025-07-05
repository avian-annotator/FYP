package com.fyp.avian_annotator.controller;

import com.fyp.avian_annotator.dto.response.CurrentUserResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {

    @GetMapping("/current_user")
    public ResponseEntity<CurrentUserResponseDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.ok(new CurrentUserResponseDTO(false, null));
        }

        return ResponseEntity.ok(new CurrentUserResponseDTO(true, userDetails.getUsername()));
    }

}
