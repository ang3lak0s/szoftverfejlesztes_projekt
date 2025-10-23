package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.OpenMicEventRepository;
import com.example.szoftverfejlesztes_projekt.OpenMicSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OpenMicService {

    @Autowired
    private OpenMicEventRepository  openMicEventRepository;

    @Autowired
    private OpenMicSlotRepository  openMicSlotRepository;

    public void generateSlotsForEvent(OpenMicEvent event) {
        LocalDateTime start = event.getStartTime();
        LocalDateTime end = event.getEndTime();

        while (start.isBefore(end)) {
            OpenMicSlot slot = new OpenMicSlot();
            slot.setStartTime(start);
            slot.setEndTime(start.plusMinutes(20));
            slot.setEvent(event);
            slot.setBooked(false);
            openMicSlotRepository.save(slot);

            start = start.plusMinutes(20);
        }
    }
}
