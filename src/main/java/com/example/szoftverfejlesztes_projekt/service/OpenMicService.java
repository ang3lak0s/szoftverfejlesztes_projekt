package com.example.szoftverfejlesztes_projekt.service;

import com.example.szoftverfejlesztes_projekt.model.Band;
import com.example.szoftverfejlesztes_projekt.model.OpenMicEvent;
import com.example.szoftverfejlesztes_projekt.model.OpenMicSlot;
import com.example.szoftverfejlesztes_projekt.repository.BandRepository;
import com.example.szoftverfejlesztes_projekt.repository.LocationRepository;
import com.example.szoftverfejlesztes_projekt.repository.OpenMicSlotRepository;
import com.example.szoftverfejlesztes_projekt.repository.OpenMicEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import com.example.szoftverfejlesztes_projekt.model.Location;

@Service
public class OpenMicService {

    @Autowired
    private OpenMicSlotRepository openMicSlotRepository;
    @Autowired
    private BandRepository bandRepository;
    @Autowired
    private OpenMicEventRepository openMicEventRepository;
    @Autowired
    private LocationRepository locationRepository;

    public String bookSlot(Long slotId, Long bandId) {
        //Keresés és ellenőrzés (NoSuchElementException, ha nem találja)
        OpenMicSlot slot = openMicSlotRepository.findById(slotId)
                .orElseThrow(() -> new NoSuchElementException("Slot not found with ID: " + slotId));

        Band band = bandRepository.findById(bandId)
                .orElseThrow(() -> new NoSuchElementException("Band not found with ID: " + bandId));

        //Már le van foglalva?
        if (slot.isBooked()) {
            throw new IllegalStateException("This slot is already booked!");
        }

        // Van-e már a bandának lefoglalva más slot ugyanabban az időben?
        // Ehhez a repository-ban kell lennie egy megfelelő lekérdezésnek!

        // Ideiglenes megoldás: kihagyjuk a konfliktus ellenőrzést
        // Ideiglenes megoldás 2: megoldjuk az eredeti problémát, ezáltal nem kell ideiglenes megoldás
        // Új probléma: Az új ideiglenes megoldás neve és leírása annyira eltér, hogy paradoxont hoztunk létre


        LocalDateTime newStart = slot.getStartTime();
        LocalDateTime newEnd   = slot.getEndTime();

        var conflicts = openMicSlotRepository.findConflicts(band, newStart, newEnd);

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Ezen az időponton máshol kell lenned főnök!");
        }

        //Foglalás és mentés
        slot.setBand(band);
        slot.setBooked(true);
        openMicSlotRepository.save(slot);

        return "Slot successfully booked by " + band.getBandName();
    }

    public OpenMicEvent updateEvent(Long id, OpenMicEvent updated) {
        return openMicEventRepository.findById(id).map(event -> {

            event.setStartTime(updated.getStartTime());
            event.setEndTime(updated.getEndTime());
            if (updated.getLocation() != null &&
                    updated.getLocation().getLocationId() != null) {

                Location loc = locationRepository
                        .findById(updated.getLocation().getLocationId())
                        .orElseThrow(() ->
                                new NoSuchElementException("Location not found with id "
                                        + updated.getLocation().getLocationId()));

                event.setLocation(loc);
            } else {
                event.setLocation(null);
            }

            return openMicEventRepository.save(event);

        }).orElseThrow(() -> new NoSuchElementException("Event not found with id " + id));
    }

}