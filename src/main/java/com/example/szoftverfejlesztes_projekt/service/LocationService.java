package com.example.szoftverfejlesztes_projekt.service;

import com.example.szoftverfejlesztes_projekt.model.Location;
import com.example.szoftverfejlesztes_projekt.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.NoSuchElementException;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public Location saveLocation(Location location) {
        return locationRepository.save(location);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationById(Long id) {
        return locationRepository.findById(id).orElse(null);
    }

    public void deleteLocationById(Long id) {
        locationRepository.deleteById(id);
    }

    public Location updateLocation(Long id, Location updated) {
        return locationRepository.findById(id).map(location -> {
            location.setLocationName(updated.getLocationName());
            location.setPhoneNum(updated.getPhoneNum());
            location.setAddress(updated.getAddress());
            location.setEmail(updated.getEmail());
            location.setAccomodation(updated.getAccomodation());
            location.setRentable(updated.isRentable());
            location.setOpenMic(updated.isOpenMic());
            location.setGenrePref(updated.getGenrePref());
            return locationRepository.save(location);
        }).orElseThrow(() ->
                new NoSuchElementException("Itt valami gond van, és nem csak a fejemben " + id));
    }
}
