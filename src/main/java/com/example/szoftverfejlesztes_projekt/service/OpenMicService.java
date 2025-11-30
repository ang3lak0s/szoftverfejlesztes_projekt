package com.example.szoftverfejlesztes_projekt.service;

import com.example.szoftverfejlesztes_projekt.model.Band;
import com.example.szoftverfejlesztes_projekt.model.OpenMicEvent;
import com.example.szoftverfejlesztes_projekt.model.OpenMicSlot;
import com.example.szoftverfejlesztes_projekt.repository.BandRepository;
import com.example.szoftverfejlesztes_projekt.repository.OpenMicSlotRepository;
import com.example.szoftverfejlesztes_projekt.repository.OpenMicEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.NoSuchElementException;

@Service
public class OpenMicService {

    @Autowired
    private OpenMicSlotRepository openMicSlotRepository;
    @Autowired
    private BandRepository bandRepository;
    @Autowired
    private OpenMicEventRepository openMicEventRepository;

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
            event.setLocation(updated.getLocation());

            return openMicEventRepository.save(event);

        }).orElseThrow(() -> new NoSuchElementException("Event not found with id " + id));
    }

}