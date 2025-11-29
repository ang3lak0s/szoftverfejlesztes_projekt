package com.example.szoftverfejlesztes_projekt.model;

import jakarta.persistence.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
public class OpenMicSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private boolean booked = false;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private OpenMicEvent event;

    @ManyToOne
    @JoinColumn(name = "band_id", nullable = true)
    private Band band; // aki foglalta a slotot


    //constructor
    public OpenMicSlot() {
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

    public boolean isBooked() {
        return booked;
    }

    public void setBooked(boolean booked) {
        this.booked = booked;
    }

    public OpenMicEvent getEvent() {
        return event;
    }

    public void setEvent(OpenMicEvent event) {
        this.event = event;
    }

    public Band getBand() {
        return band;
    }

    public void setBand(Band band) {
        this.band = band;
    }

    //kell a controllerben a lekérdezéshez hogy a bandának a felvenni kívánt időpontban
    //van e már korábbi jelentkezése abban az időpontban.
    public Duration getSlotTime() {
        return Duration.between(startTime, endTime);
    }
}
