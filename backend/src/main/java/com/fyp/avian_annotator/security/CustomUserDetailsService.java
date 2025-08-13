package com.fyp.avian_annotator.security;

import com.fyp.avian_annotator.dal.entity.User;
import com.fyp.avian_annotator.dal.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Optional<User> user = userRepository.findByUsername(username);
    if (user.isPresent()) {
      var userObj = user.get();
      return new CustomUserDetails(
          userObj.getId(),
          userObj.getUsername(),
          userObj.getPasswordHash(),
          // map userObj.getRole() to authorities as needed
          List.of(new SimpleGrantedAuthority("ROLE_" + userObj.getRole())));
    } else {
      throw new UsernameNotFoundException(username);
    }
  }
}
