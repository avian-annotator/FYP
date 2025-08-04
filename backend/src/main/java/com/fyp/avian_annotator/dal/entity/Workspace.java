package com.fyp.avian_annotator.dal.entity;

import jakarta.persistence.*;
import lombok.Builder;

@Entity
@Table(name = "workspace")
@Builder
public class Workspace {

  @Id private Long id;

  @ManyToOne
  @JoinColumn(name = "owner_id")
  private User owner;

  private String name;
}
