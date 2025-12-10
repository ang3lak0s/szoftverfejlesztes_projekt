package com.example.szoftverfejlesztes_projekt.dto;

public class OpenMicSlotDTO {
    private Long id;
    private String startTime;
    private String endTime;
    private boolean booked;
    private String locationName;

    public OpenMicSlotDTO(Long id, String startTime, String endTime, boolean booked, String locationName) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.booked = booked;
        this.locationName = locationName;
    }

    // getterek
    public Long getId() { return id; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public boolean isBooked() { return booked; }
    public String getLocationName() { return locationName; }

    // setterek
    public void setId(Long id) { this.id = id; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public void setBooked(boolean booked) { this.booked = booked; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
}
