package com.example.szoftverfejlesztes_projekt;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String locationId;    //osszetett kulcsra lecserélni??

    private String locationName;

    private String phoneNum;

    private String address;

    private String email;

    private double accomodation;

    private boolean rentable;

    private boolean OpenMic;

    private String genrePref;



    // Getters and setters
    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
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
        return OpenMic;
    }

    public void setOpenMic(boolean openMic) {
        OpenMic = openMic;
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
