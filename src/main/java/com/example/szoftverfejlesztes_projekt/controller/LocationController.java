package com.example.szoftverfejlesztes_projekt.controller;

import com.example.szoftverfejlesztes_projekt.model.Location;
import com.example.szoftverfejlesztes_projekt.model.OpenMicSlot;
import com.example.szoftverfejlesztes_projekt.repository.OpenMicSlotRepository;
import com.example.szoftverfejlesztes_projekt.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @Autowired
    private OpenMicSlotRepository openMicSlotRepository;

    @PostMapping
    public Location createLocation(@RequestBody Location location) {
        return locationService.saveLocation(location);
    }

    @GetMapping
    public List<Location> getAllLocations() {
        return locationService.getAllLocations();
    }

    @GetMapping("/{id}")
    public Location getLocationById(@PathVariable Long id) {
        return locationService.getLocationById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteLocationById(@PathVariable Long id) {
        locationService.deleteLocationById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(
            @PathVariable Long id,
            @RequestBody Location updatedLocation) {
        try {
            Location saved = locationService.updateLocation(id, updatedLocation);
            return ResponseEntity.ok(saved);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/slots")
    public List<OpenMicSlot> getSlotsForLocation(@PathVariable Long id) {
        return openMicSlotRepository.findByEventLocationLocationId(id);
    }

}
