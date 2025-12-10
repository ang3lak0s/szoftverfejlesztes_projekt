package com.example.szoftverfejlesztes_projekt.controller;

import com.example.szoftverfejlesztes_projekt.dto.OpenMicSlotDTO;
import com.example.szoftverfejlesztes_projekt.model.OpenMicEvent;
import com.example.szoftverfejlesztes_projekt.model.OpenMicSlot;
import com.example.szoftverfejlesztes_projekt.repository.OpenMicEventRepository;
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

    @Autowired
    private OpenMicEventRepository openMicEventRepository;

    @GetMapping
    public List<OpenMicSlotDTO> getAll() {
        List<OpenMicSlot> slots = openMicSlotRepository.findAll();

        return slots.stream()
                .map(slot -> {
                    String locationName = "";
                    if (slot.getEvent() != null && slot.getEvent().getLocation() != null) {
                        locationName = slot.getEvent().getLocation().getLocationName();
                    }
                    return new OpenMicSlotDTO(
                            slot.getId(),
                            slot.getStartTime().toString(),
                            slot.getEndTime().toString(),
                            slot.isBooked(),
                            locationName
                    );
                })
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpenMicSlotDTO> getById(@PathVariable Long id) {
        try {
            OpenMicSlot slot = openMicSlotRepository.findById(id).orElseThrow();
            String locationName = "";
            if (slot.getEvent() != null && slot.getEvent().getLocation() != null) {
                locationName = slot.getEvent().getLocation().getLocationName();
            }
            OpenMicSlotDTO dto = new OpenMicSlotDTO(
                    slot.getId(),
                    slot.getStartTime().toString(),
                    slot.getEndTime().toString(),
                    slot.isBooked(),
                    locationName
            );
            return ResponseEntity.ok(dto);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public OpenMicSlot create(@RequestBody OpenMicSlot slot) {
        attachEvent(slot);
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
                        if (updated.getEvent() != null && updated.getEvent().getId() != null) {
                            OpenMicEvent ev = openMicEventRepository
                                    .findById(updated.getEvent().getId())
                                    .orElseThrow();
                            slot.setEvent(ev);
                        } else {
                            slot.setEvent(null);
                        }
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

    private void attachEvent(OpenMicSlot slot) {
        if (slot.getEvent() != null && slot.getEvent().getId() != null) {
            OpenMicEvent ev = openMicEventRepository
                    .findById(slot.getEvent().getId())
                    .orElseThrow();
            slot.setEvent(ev);
        } else {
            slot.setEvent(null);
        }
    }
}
