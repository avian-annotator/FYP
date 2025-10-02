package com.fyp.avian_annotator.dal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

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
    
    @JdbcTypeCode(SqlTypes.BINARY)
    private byte[] annotations = new byte[0];

    @Builder
    public Image(Workspace workspace, String fileName) {
        this.workspace = workspace;
        this.fileName = fileName;
    }
}
