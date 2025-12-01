package com.example.szoftverfejlesztes_projekt.controller;

import com.example.szoftverfejlesztes_projekt.model.Band;
import com.example.szoftverfejlesztes_projekt.model.Location;
import com.example.szoftverfejlesztes_projekt.model.User;
import com.example.szoftverfejlesztes_projekt.model.UserRole;
import com.example.szoftverfejlesztes_projekt.repository.UserRepository;
import com.example.szoftverfejlesztes_projekt.repository.BandRepository;
import com.example.szoftverfejlesztes_projekt.repository.LocationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BandRepository bandRepository;

    @Autowired
    private LocationRepository locationRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        if (user.getRole() == UserRole.BAND && user.getBand() != null) {
            Band band = user.getBand();
            band.setBandId(null);
            band = bandRepository.save(band);
            user.setBand(band);
        } else {
            user.setBand(null);
        }

        if (user.getRole() == UserRole.LOCATION && user.getLocation() != null) {
            Location loc = user.getLocation();
            loc.setLocationId(null);
            loc = locationRepository.save(loc);
            user.setLocation(loc);
        } else {
            user.setLocation(null);
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {

        return userRepository.findByEmail(loginRequest.getEmail())
                .map(user -> {

                    if (!user.getPassword().equals(loginRequest.getPassword())) {
                        return ResponseEntity.badRequest().body("Caps Lock bentmaradt, vagy valami, próbáld újra, vagy ne, nem az én dolgom");
                    }

                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.badRequest().body("Gondolom előbb regiisztrálni kéne, de csak gondolom..."));
    }
}
