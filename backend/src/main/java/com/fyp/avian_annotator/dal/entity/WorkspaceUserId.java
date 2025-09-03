package com.fyp.avian_annotator.dal.entity;

import java.io.Serializable;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class WorkspaceUserId implements Serializable {

  private Long workspace;
  private Long user;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof WorkspaceUserId that)) return false;
    return Objects.equals(workspace, that.workspace) && Objects.equals(user, that.user);
  }

  @Override
  public int hashCode() {
    return Objects.hash(workspace, user);
  }
}
