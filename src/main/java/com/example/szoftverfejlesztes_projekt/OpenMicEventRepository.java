package com.example.szoftverfejlesztes_projekt;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpenMicEventRepository extends JpaRepository <OpenMicEvent, Long> {
    List<OpenMicEvent> findByLocation(Location location);
}
