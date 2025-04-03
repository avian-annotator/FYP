package com.example.avian_annotator.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column()
    private String role;

    @PrePersist
    protected void onCreate(){
        if (this.role == null){
            this.role = "ROLE_USER";
        }
    }
}
