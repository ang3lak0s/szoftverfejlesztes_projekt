package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.Band;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BandRepository extends JpaRepository<Band, Long> {
}
