package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.Location;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends CrudRepository<Location, Long> {
}
