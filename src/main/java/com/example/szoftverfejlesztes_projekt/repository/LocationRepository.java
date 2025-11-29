package com.example.szoftverfejlesztes_projekt.repository;

import com.example.szoftverfejlesztes_projekt.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
}
