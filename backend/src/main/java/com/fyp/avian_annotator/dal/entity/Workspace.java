package com.fyp.avian_annotator.dal.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "workspace")
@Getter
@Setter
@Builder
public class Workspace {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "owner_id")
  private User owner;

  private String name;

  protected Workspace() {}
}
