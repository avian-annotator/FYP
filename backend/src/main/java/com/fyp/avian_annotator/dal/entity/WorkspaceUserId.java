package com.fyp.avian_annotator.dal.entity;

import java.io.Serializable;
import java.util.Objects;

public class WorkspaceUserId implements Serializable {

    private Long workspace;
    private Long user;

    public WorkspaceUserId() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof WorkspaceUserId)) return false;
        WorkspaceUserId that = (WorkspaceUserId) o;
        return Objects.equals(workspace, that.workspace) &&
                Objects.equals(user, that.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(workspace, user);
    }
}
