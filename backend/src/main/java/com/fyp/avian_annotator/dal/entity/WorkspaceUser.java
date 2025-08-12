package com.fyp.avian_annotator.dal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workspace_user")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@IdClass(WorkspaceUserId.class)
public class WorkspaceUser {

  @Id
  @ManyToOne
  @JoinColumn(name = "workspace_id")
  private Workspace workspace;

  @Id
  @ManyToOne
  @JoinColumn(name = "app_user_id")
  private User user;
}
