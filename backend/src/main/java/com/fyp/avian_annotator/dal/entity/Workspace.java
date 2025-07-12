package com.fyp.avian_annotator.dal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "workspace")
public class Workspace {

  @Id private Long id;

  @ManyToOne
  @JoinColumn(name = "owner_id")
  private User owner;

  private String name;
}
