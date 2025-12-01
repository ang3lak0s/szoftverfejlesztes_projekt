package com.example.szoftverfejlesztes_projekt.controller;

import com.example.szoftverfejlesztes_projekt.model.User;
import com.example.szoftverfejlesztes_projekt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.szoftverfejlesztes_projekt.repository.UserRepository;
import com.example.szoftverfejlesztes_projekt.repository.BandRepository;
import com.example.szoftverfejlesztes_projekt.repository.LocationRepository;
import com.example.szoftverfejlesztes_projekt.model.User;
import com.example.szoftverfejlesztes_projekt.model.Band;
import com.example.szoftverfejlesztes_projekt.model.Location;

import java.util.List;
import org.springframework.http.ResponseEntity;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BandRepository bandRepository;

    @Autowired
    private LocationRepository locationRepository;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser
    ) {
        try {
            User saved = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(saved);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}