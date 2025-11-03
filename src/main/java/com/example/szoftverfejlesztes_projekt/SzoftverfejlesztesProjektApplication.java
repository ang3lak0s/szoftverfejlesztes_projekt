package com.example.szoftverfejlesztes_projekt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired; // <-- Needed for injection
import java.util.List; // <-- Needed for the list of bands

@SpringBootApplication
@RestController
@RequestMapping("/main")
public class SzoftverfejlesztesProjektApplication {

    //BandRepository interfaceből kikérjük a h2-es BAND táblát
    @Autowired
    private BandRepository bandRepository;

    public static String test()
    {
        return String.format("This is a test.");
    }

    public String hello(@RequestParam(value = "myName", defaultValue = "World") String name)
    {
        return String.format("Hello %s!", name);
    }

    @GetMapping
    public String mainHandler()
    {
        // Minden adat kifetchelése H2 repobol
        List<Band> bands = bandRepository.findAll();

        // Sima test methodok (ÁRON LEHET KÉNE KEZDENI A JUNIT TESTING-ET>:( )
        String testResult = test();
        String helloResult = hello("TestUser");

        // Bandák adatainak formatting
        StringBuilder bandDataHtml = new StringBuilder("<h2>Available Bands:</h2><ul>");
        for (Band band : bands) {
            if (band.getBandName().equals("HOC")) {
            // H2-ből adatok elérése getter-ekkel
            bandDataHtml.append("<li>")
                    .append("ID: ").append(band.getBandId())
                    .append(", Name: <strong>").append(band.getBandName()).append(" (legszexibb banda ever)</strong>")
                    .append(", Genre: ").append(band.getPlayedGenre())
                    .append(", Rate: ").append(band.getPricePerHour())
                    .append("</li>");
            }
            else
            {
                bandDataHtml.append("<li>")
                        .append("ID: ").append(band.getBandId())
                        .append(", Name: <strong>").append(band.getBandName()).append("</strong>")
                        .append(", Genre: ").append(band.getPlayedGenre())
                        .append(", Rate: ").append(band.getPricePerHour())
                        .append("</li>");
            }
        }
        bandDataHtml.append("</ul>");

        // 4. Return the combined output
        return String.format(
                "<h1>Main Page Content</h1>" +
                        "<p>Test Result: <strong>%s</strong></p>" +
                        "<p>Hello Result: <strong>%s</strong></p>" +
                        "%s", // Insert the database data here
                testResult,
                helloResult,
                bandDataHtml.toString()
        );
    }

    // ... (The rest of your class methods) ...
    // Example:
    public static void main(String[] args) {
        SpringApplication.run(SzoftverfejlesztesProjektApplication.class, args);
    }
    // ...
}