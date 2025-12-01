package com.example.szoftverfejlesztes_projekt.repository;

import com.example.szoftverfejlesztes_projekt.model.Band;
import com.example.szoftverfejlesztes_projekt.model.OpenMicEvent;
import com.example.szoftverfejlesztes_projekt.model.OpenMicSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OpenMicSlotRepository extends JpaRepository<OpenMicSlot, Long> {
    List<OpenMicSlot> findByEvent(OpenMicEvent event);

    List<OpenMicSlot> findByEventLocationLocationId(Long locationId);

    @Query("SELECT s FROM OpenMicSlot s " +
            "WHERE s.band = :band " +
            "WHERE s.band = :band " +
            "AND s.booked = true " +
            "AND s.endTime > :start " +
            "AND s.startTime < :end")
    List<OpenMicSlot> findConflicts(@Param("band") Band band,
                                    @Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end);
}
