package com.example.szoftverfejlesztes_projekt;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Band {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bandId;

    private String bandName;

    private String playedGenre;

    private String phoneNum;

    private String email;

    private Long pricePerHour;

    private boolean acceptsPercentage;

    //constructors
    public Band() {}

    //getters setters
    public Long getBandId() {
        return bandId;
    }

    public void setBandId(Long bandId) {
        this.bandId = bandId;
    }

    public String getBandName() {
        return bandName;
    }

    public void setBandName(String bandName) {
        this.bandName = bandName;
    }

    public String getPlayedGenre() {
        return playedGenre;
    }

    public void setPlayedGenre(String playedGenre) {
        this.playedGenre = playedGenre;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(Long pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public boolean isAcceptsPercentage() {
        return acceptsPercentage;
    }

    public void setAcceptsPercentage(boolean acceptsPercentage) {
        this.acceptsPercentage = acceptsPercentage;
    }
}
