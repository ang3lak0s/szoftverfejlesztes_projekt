package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.Band;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BandRepository extends CrudRepository<Band, Long> {
}
