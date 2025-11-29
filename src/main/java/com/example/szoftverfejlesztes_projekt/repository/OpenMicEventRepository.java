package com.example.szoftverfejlesztes_projekt.repository;

import com.example.szoftverfejlesztes_projekt.model.Location;
import com.example.szoftverfejlesztes_projekt.model.OpenMicEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpenMicEventRepository extends JpaRepository <OpenMicEvent, Long> {
    List<OpenMicEvent> findByLocation(Location location);
}
