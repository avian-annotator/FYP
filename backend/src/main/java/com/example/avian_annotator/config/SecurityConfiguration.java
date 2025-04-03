package com.example.avian_annotator.config;

import com.example.avian_annotator.enums.Role;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Slf4j
@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity.authorizeHttpRequests(registry -> {
            registry.requestMatchers("/api/register_user/**").hasAnyAuthority(Role.ADMIN);
            registry.requestMatchers("/api/**").hasAnyAuthority(Role.USER);
            registry.anyRequest().authenticated();
        }).build();
    }
}
