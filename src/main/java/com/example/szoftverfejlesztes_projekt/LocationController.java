package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.Location;
import com.example.szoftverfejlesztes_projekt.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping
    public Location createLocation(@RequestBody Location location) {
        return locationService.saveLocation(location);
    }

    @GetMapping
    public List<Location> getAllLocations() {
        return locationService.getAllLocations();
    }

    @GetMapping("/{id}")
    public Location getLocationById(@PathVariable Long id) {
        return locationService.getLocationById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteLocationById(@PathVariable Long id) {
        locationService.deleteLocationById(id);
    }

}
