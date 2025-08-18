package com.fyp.avian_annotator.dal.repository;

import com.fyp.avian_annotator.dal.entity.Image;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, String> {

    Page<Image> findImageByWorkspaceId(Long workspaceId, Pageable pageable);

    List<Image> findByWorkspaceId(Long workspaceId);
}
