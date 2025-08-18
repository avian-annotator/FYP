package com.fyp.avian_annotator.dal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "workspace")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Workspace {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "owner_id")
  private User owner;

  private String name;

  @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  @JsonIgnore
  private List<WorkspaceUser> workspaceUsers = new ArrayList<>();

  @OneToMany(mappedBy = "url", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  @JsonIgnore
  private List<Image> images = new ArrayList<>();
}
