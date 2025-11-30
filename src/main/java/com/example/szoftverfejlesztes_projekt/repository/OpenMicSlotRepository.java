package com.example.szoftverfejlesztes_projekt.repository;

import com.example.szoftverfejlesztes_projekt.model.OpenMicEvent;
import com.example.szoftverfejlesztes_projekt.model.OpenMicSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpenMicSlotRepository extends JpaRepository<OpenMicSlot, Long> {
    List<OpenMicSlot> findByEvent(OpenMicEvent event);

    List<OpenMicSlot> findByEventLocationLocationId(Long locationId);
}
