package com.fyp.avian_annotator.dal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "image")
public class Image {

    @Id
    private String url;

    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private WorkspaceUser workspace;

    private String filename;

    /**
     * TODO: add custom definition instead of String once we figure our JSON coco
     */
    private String annotations;


}
