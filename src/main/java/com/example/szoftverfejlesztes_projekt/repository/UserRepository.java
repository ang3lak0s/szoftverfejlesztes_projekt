package com.example.szoftverfejlesztes_projekt.repository;

import com.example.szoftverfejlesztes_projekt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndPassword(String email, String password);
}
