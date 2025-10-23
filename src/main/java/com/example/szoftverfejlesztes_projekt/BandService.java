package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.Band;
import com.example.szoftverfejlesztes_projekt.BandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BandService {

    @Autowired
    private BandRepository bandRepository;

    @Autowired
    private LocationRepository locationRepository;

    public Band saveBand(Band band) {
        return bandRepository.save(band);
    }

    public List<Band> getAllBands() {
        return bandRepository.findAll();
    }

    public Band getBandById(Long id) {
        return bandRepository.findById(id).orElse(null);
    }

    public void deleteBandById(Long id) {
        bandRepository.deleteById(id);
    }
}
