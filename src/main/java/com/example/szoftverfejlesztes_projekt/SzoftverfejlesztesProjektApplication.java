package com.example.szoftverfejlesztes_projekt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class SzoftverfejlesztesProjektApplication {

    public static void main(String[] args) {
        SpringApplication.run(SzoftverfejlesztesProjektApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello(@RequestParam(value = "myName", defaultValue = "World") String name)
    {
        return String.format("Hello %s!", name);
    }

}
