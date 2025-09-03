package com.fyp.avian_annotator.dal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "workspace")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Workspace {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "owner_id")
  private User owner;

  private String name;

  @Column(nullable = false, unique = true, updatable = false, length = 16)
  private String bucketPrefix = UUID.randomUUID().toString().substring(0, 16);

  @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<WorkspaceUser> workspaceUsers = new ArrayList<>();

  @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<Image> images = new ArrayList<>();

  @Builder
  public Workspace(Long id, User owner, String name) {
    this.id = id;
    this.owner = owner;
    this.name = name;
  }
}
