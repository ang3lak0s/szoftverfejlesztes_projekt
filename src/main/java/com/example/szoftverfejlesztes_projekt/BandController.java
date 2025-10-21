package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.Band;
import com.example.szoftverfejlesztes_projekt.BandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bands")
public class BandController {

    @Autowired
    private BandService bandService;

    @PostMapping
    public Band createBand(@RequestBody Band band) {
        return bandService.saveBand(band);
    }

    @GetMapping
    public List<Band> getAllBands() {
        return bandService.getAllBands();
    }

    @GetMapping("/{id}")
    public Band getBandById(@PathVariable Long id) {
        return bandService.getBandById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteBandById(@PathVariable Long id) {
        bandService.deleteBandById(id);
    }
}
