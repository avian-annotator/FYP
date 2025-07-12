package com.fyp.avian_annotator.dal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "workspace_user")
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
