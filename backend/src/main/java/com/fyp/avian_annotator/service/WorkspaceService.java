package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dal.entity.Workspace;
import com.fyp.avian_annotator.dal.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final SecurityContext securityContext;

    public Workspace createUserWorkspace(){
        Workspace newWorkSpace = Workspace.builder().owner()
    }
}
