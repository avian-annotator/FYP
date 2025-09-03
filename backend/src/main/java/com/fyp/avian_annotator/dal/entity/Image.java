package com.fyp.avian_annotator.dal.entity;

import jakarta.persistence.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "image")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Image {

  @Id
  @Column(nullable = false, unique = true, updatable = false, length = 16)
  private String bucketIdentifier = UUID.randomUUID().toString().substring(0, 16);

  @ManyToOne
  @JoinColumn(name = "workspace_id")
  private Workspace workspace;

  @Column(nullable = false)
  private String fileName;

  /** TODO: add custom definition instead of this once we figure our JSON coco */
  @JdbcTypeCode(SqlTypes.JSON)
  private Map<String, Object> annotations = new HashMap<>();

  @Builder
  public Image(Workspace workspace, String fileName) {
    this.workspace = workspace;
    this.fileName = fileName;
  }
}
