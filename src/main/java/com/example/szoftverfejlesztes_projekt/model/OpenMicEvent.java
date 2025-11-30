package com.example.szoftverfejlesztes_projekt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class OpenMicEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime; // pl. 2025-10-28 21:00
    private LocalDateTime endTime;   // pl. 2025-10-28 00:00 (másnap hajnali 0:00)

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OpenMicSlot> slots; // az időpontokra bontott bejegyzések

    //constructor
    public OpenMicEvent() {
    }

    //getters setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public List<OpenMicSlot> getSlots() {
        return slots;
    }

    public void setSlots(List<OpenMicSlot> slots) {
        this.slots = slots;
    }
}
