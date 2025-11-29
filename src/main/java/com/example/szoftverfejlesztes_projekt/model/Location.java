package com.example.szoftverfejlesztes_projekt.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;    //osszetett kulcsra lecserélni??

    private String locationName;

    private String phoneNum;

    private String address;

    private String email;

    private double accomodation;

    private boolean rentable;

    private boolean openMic;

    private String genrePref;


    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL)
    private List<OpenMicEvent> openMicEvents;

    //Constructors
    public Location() {}

    public Location(String name, String address, String phoneNum) {
        this.locationName = name;
        this.address = address;
        this.phoneNum = phoneNum;
    }


    // Getters and setters
    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getAccomodation() {
        return accomodation;
    }

    public void setAccomodation(double accomodation) {
        this.accomodation = accomodation;
    }

    public boolean isOpenMic() {
        return openMic;
    }

    public void setOpenMic(boolean openMic) {
        this.openMic = openMic;
    }

    public boolean isRentable() {
        return rentable;
    }

    public void setRentable(boolean rentable) {
        this.rentable = rentable;
    }

    public String getGenrePref() {
        return genrePref;
    }

    public void setGenrePref(String genrePref) {
        this.genrePref = genrePref;
    }
}
