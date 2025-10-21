package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.Band;
import com.example.szoftverfejlesztes_projekt.BandService;
import com.example.szoftverfejlesztes_projekt.OpenMicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bands")
public class BandController {

    @Autowired
    private BandService bandService;
    @Autowired
    private OpenMicSlotRepository openMicSlotRepository;
    @Autowired
    private BandRepository bandRepository;

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

    //open mic slot booking
    @PostMapping("/openmic/slots/{slotId}/book/{bandId}")
    public ResponseEntity<String> bookSlot(@PathVariable Long slotId, @PathVariable Long bandId) {
        OpenMicSlot slot = openMicSlotRepository.findById(slotId).orElseThrow();
        Band band = bandRepository.findById(bandId).orElseThrow();

        //már le van e foglalva az az idopont
        if (slot.isBooked()) {
            return ResponseEntity.badRequest().body("This slot is already booked!");
        }

        //van e a bandanak akkor az idopontban mar utkozo open mic jelentkezése.
        boolean hasConflict = openMicSlotRepository.findById(bandId).stream()
                .anyMatch(s -> s.getSlotTime().equals(slot.getSlotTime()));
        if (hasConflict) {
            return ResponseEntity.badRequest().body("This band already has a slot at this time!");
        }

        //ráment a slotra amikorra jelentkezik a banda
        slot.setBand(band);
        slot.setBooked(true);
        openMicSlotRepository.save(slot);

        return ResponseEntity.ok("Slot successfully booked by " + band.getBandName());
    }
}
