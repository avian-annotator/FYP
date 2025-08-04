package com.fyp.avian_annotator.controller;

import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dto.request.CreateWorkspaceRequestBodyDTO;
import com.fyp.avian_annotator.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/workspaces")
@RestController
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping()
    public void createWorkspace(@AuthenticationPrincipal UserDetails userDetails, @RequestBody CreateWorkspaceRequestBodyDTO name) {
        Workspace workspace = workspaceService.createUserWorkspace((CustomDetailsService) userDetails.getUsername(), name.getName());
    }


}
