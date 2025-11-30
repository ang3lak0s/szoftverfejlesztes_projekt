package com.example.szoftverfejlesztes_projekt.controller;

import com.example.szoftverfejlesztes_projekt.model.Location;
import com.example.szoftverfejlesztes_projekt.model.OpenMicEvent;
import com.example.szoftverfejlesztes_projekt.repository.LocationRepository;
import com.example.szoftverfejlesztes_projekt.repository.OpenMicEventRepository;
import com.example.szoftverfejlesztes_projekt.service.OpenMicService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/openmic")
@CrossOrigin(origins = "*")
public class OpenMicEventController {

    @Autowired
    private OpenMicEventRepository openMicEventRepository;

    @Autowired
    private OpenMicService openMicService;

    @Autowired
    private LocationRepository locationRepository;

    @GetMapping
    public List<OpenMicEvent> getAll() {
        return openMicEventRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpenMicEvent> getById(@PathVariable Long id) {
        return openMicEventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OpenMicEvent create(@RequestBody OpenMicEvent event) {
        attachLocation(event);
        return openMicEventRepository.save(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpenMicEvent> update(
            @PathVariable Long id,
            @RequestBody OpenMicEvent updated) {

        try {
            return openMicEventRepository.findById(id)
                    .map(existing -> {
                        existing.setStartTime(updated.getStartTime());
                        existing.setEndTime(updated.getEndTime());
                        // location frissítése
                        if (updated.getLocation() != null &&
                                updated.getLocation().getLocationId() != null) {
                            Location loc = locationRepository
                                    .findById(updated.getLocation().getLocationId())
                                    .orElseThrow();
                            existing.setLocation(loc);
                        } else {
                            existing.setLocation(null);
                        }
                        return ResponseEntity.ok(openMicEventRepository.save(existing));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!openMicEventRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        openMicEventRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void attachLocation(OpenMicEvent event) {
        if (event.getLocation() != null &&
                event.getLocation().getLocationId() != null) {

            Location loc = locationRepository
                    .findById(event.getLocation().getLocationId())
                    .orElseThrow();
            event.setLocation(loc);
        } else {
            event.setLocation(null);
        }
    }

}
