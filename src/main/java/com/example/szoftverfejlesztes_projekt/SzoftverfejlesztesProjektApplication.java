package com.example.szoftverfejlesztes_projekt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;


@SpringBootApplication
@RestController
@RequestMapping("/main")
public class SzoftverfejlesztesProjektApplication {


    public static void main(String[] args) {
        SpringApplication.run(SzoftverfejlesztesProjektApplication.class, args);
    }

    public static String test()
    {
        return String.format("This is a test.");
    }

    public String hello(@RequestParam(value = "myName", defaultValue = "World") String name)
    {
        return String.format("Hello %s!", name);
    }

    public String createBand()
    {
        Band band1 = new Band();
        band1.setBandName("HOC");
        band1.setBandId(67L);
        band1.setEmail("hoc@kurvaanyad.com");
        return String.format("Created the band %s with id %d", band1.getBandName(), band1.getBandId());
    }

    @GetMapping
    public String mainHandler()
    {
        String bandTest = createBand();
        String testResult = test();

        String helloResult = hello("test");

        return String.format(
                "<h1>Main Page Content</h1>" +
                        "<p>Test Result: <strong>%s</strong></p>" +
                        "<p>Hello Result: <strong>%s</strong></p>" +
                        "<p>BandTest Result: <strong>%s</strong></p>",
                testResult,
                helloResult,
                bandTest
        );
    }


}
