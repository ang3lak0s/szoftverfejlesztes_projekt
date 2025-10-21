package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.Location;
import com.example.szoftverfejlesztes_projekt.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public Location saveLocation(Location location) {
        return locationRepository.save(location);
    }

    public Iterable<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationById(Long id) {
        return locationRepository.findById(id).orElse(null);
    }

    public void deleteLocationById(Long id) {
        locationRepository.deleteById(id);
    }
}
