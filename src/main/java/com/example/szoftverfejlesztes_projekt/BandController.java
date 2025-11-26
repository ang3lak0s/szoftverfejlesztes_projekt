package com.example.szoftverfejlesztes_projekt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException; // Hibakezeléshez

@RestController
@RequestMapping("/api/bands")
public class BandController {

    // Csak a Service réteget injektáljuk, nem a Repository-t!
    @Autowired
    private BandService bandService;
    @Autowired
    private OpenMicService openMicService; // A foglalási logikáért felel

    // --- Band CRUD Műveletek ---

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // HTTP 201 Created
    public Band createBand(@RequestBody Band band) {
        return bandService.saveBand(band);
    }

    @GetMapping
    public List<Band> getAllBands() {
        return bandService.getAllBands();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Band> getBandById(@PathVariable Long id) {
        try {
            // A Service dobjon kivételt, ha nem találja
            Band band = bandService.getBandById(id);
            return ResponseEntity.ok(band);
        } catch (NoSuchElementException e) {
            // Ha a banda nem létezik, HTTP 404 (Not Found)
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // HTTP 204 No Content
    public void deleteBandById(@PathVariable Long id) {
        bandService.deleteBandById(id);
    }

    // --- Open Mic Slot Foglalás ---

    /**
     * Foglalási kérés delegálása az OpenMicService-nek.
     * A Service kezeli az összes üzleti logikát (konfliktus, lefoglaltság, mentés).
     * @param slotId A foglalandó slot ID-ja
     * @param bandId A foglaló banda ID-ja
     */
    @PostMapping("/openmic/slots/{slotId}/book/{bandId}")
    public ResponseEntity<String> bookSlot(@PathVariable Long slotId, @PathVariable Long bandId) {
        try {
            String result = openMicService.bookSlot(slotId, bandId);
            return ResponseEntity.ok(result); // Sikeres foglalás: HTTP 200 OK
        } catch (NoSuchElementException e) {
            // Ha a slot vagy a banda nem létezik
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // HTTP 404 Not Found
        } catch (IllegalStateException e) {
            // Ha már le van foglalva, vagy időkonfliktus van (üzleti hiba)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); // HTTP 400 Bad Request
        }
    }
}