package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
}
