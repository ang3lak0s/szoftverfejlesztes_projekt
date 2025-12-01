package com.example.szoftverfejlesztes_projekt.service;

import com.example.szoftverfejlesztes_projekt.model.User;
import com.example.szoftverfejlesztes_projekt.repository.BandRepository;
import com.example.szoftverfejlesztes_projekt.repository.LocationRepository;
import com.example.szoftverfejlesztes_projekt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BandRepository bandRepository;

    @Autowired
    private LocationRepository locationRepository;

    public User saveUser(User user) {
        attachRelations(user);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User updated) {
        return userRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setPassword(updated.getPassword());
                    existing.setRole(updated.getRole());

                    existing.setBand(updated.getBand());
                    existing.setLocation(updated.getLocation());

                    attachRelations(existing);
                    return userRepository.save(existing);
                })
                .orElseThrow(() -> new NoSuchElementException("Sajnos nem létezel, így jártál"));
    }

    private void attachRelations(User user) {

        if (user.getBand() != null && user.getBand().getBandId() != null) {
            var band = bandRepository.findById(user.getBand().getBandId())
                    .orElseThrow(() -> new NoSuchElementException("A Bandád feloszlott, keress másik állást"));
            user.setBand(band);
        } else {
            user.setBand(null);
        }

        if (user.getLocation() != null && user.getLocation().getLocationId() != null) {
            var loc = locationRepository.findById(user.getLocation().getLocationId())
                    .orElseThrow(() -> new NoSuchElementException("A helyszín már nem helyszín sajnos"));
            user.setLocation(loc);
        } else {
            user.setLocation(null);
        }
    }

    public boolean exists(Long id) { return userRepository.existsById(id); }

}