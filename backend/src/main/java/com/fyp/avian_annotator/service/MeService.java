package com.fyp.avian_annotator.service;

import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dto.response.UserResponseDTO;
import com.fyp.avian_annotator.utils.UserRole;

public interface MeService {

    UserResponseDTO getMe(Long id);

    User editMe(Long id, String userName, String password, UserRole role);

    void deleteMe(Long id);

}
