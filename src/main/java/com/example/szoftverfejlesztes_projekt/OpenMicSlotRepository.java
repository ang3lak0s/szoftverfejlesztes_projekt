package com.example.szoftverfejlesztes_projekt;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpenMicSlotRepository extends JpaRepository<OpenMicSlot, Long> {
    List<OpenMicSlot> findByEvent(OpenMicEvent event);
}
