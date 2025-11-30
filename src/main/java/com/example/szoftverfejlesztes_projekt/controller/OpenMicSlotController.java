package com.example.szoftverfejlesztes_projekt.controller;

import com.example.szoftverfejlesztes_projekt.model.OpenMicSlot;
import com.example.szoftverfejlesztes_projekt.repository.OpenMicSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = "*")
public class OpenMicSlotController {

    @Autowired
    private OpenMicSlotRepository openMicSlotRepository;

    @GetMapping
    public List<OpenMicSlot> getAll() {
        return openMicSlotRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpenMicSlot> getById(@PathVariable Long id) {
        return openMicSlotRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OpenMicSlot create(@RequestBody OpenMicSlot slot) {
        // event/band most maradhat null
        return openMicSlotRepository.save(slot);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpenMicSlot> update(
            @PathVariable Long id,
            @RequestBody OpenMicSlot updated) {

        try {
            OpenMicSlot saved = openMicSlotRepository.findById(id)
                    .map(slot -> {
                        slot.setStartTime(updated.getStartTime());
                        slot.setEndTime(updated.getEndTime());
                        slot.setBooked(updated.isBooked());
                        // event / band később, ha akarjuk
                        return openMicSlotRepository.save(slot);
                    })
                    .orElseThrow(() -> new NoSuchElementException("Slot not found"));
            return ResponseEntity.ok(saved);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!openMicSlotRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        openMicSlotRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
