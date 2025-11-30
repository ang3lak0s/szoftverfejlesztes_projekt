package com.example.szoftverfejlesztes_projekt.controller;

import com.example.szoftverfejlesztes_projekt.model.OpenMicEvent;
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
        return openMicEventRepository.save(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpenMicEvent> update(
            @PathVariable Long id,
            @RequestBody OpenMicEvent updated) {

        try {
            OpenMicEvent saved = openMicService.updateEvent(id, updated);
            return ResponseEntity.ok(saved);
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
}
