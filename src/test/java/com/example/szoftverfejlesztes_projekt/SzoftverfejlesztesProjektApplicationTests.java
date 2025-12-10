package com.example.szoftverfejlesztes_projekt;

import com.example.szoftverfejlesztes_projekt.controller.BandController;
import com.example.szoftverfejlesztes_projekt.model.Band;
import com.example.szoftverfejlesztes_projekt.model.Location;
import com.example.szoftverfejlesztes_projekt.model.OpenMicEvent;
import com.example.szoftverfejlesztes_projekt.model.OpenMicSlot;
import com.example.szoftverfejlesztes_projekt.model.User;
import com.example.szoftverfejlesztes_projekt.model.UserRole;
import com.example.szoftverfejlesztes_projekt.repository.BandRepository;
import com.example.szoftverfejlesztes_projekt.repository.LocationRepository;
import com.example.szoftverfejlesztes_projekt.repository.OpenMicEventRepository;
import com.example.szoftverfejlesztes_projekt.repository.OpenMicSlotRepository;
import com.example.szoftverfejlesztes_projekt.repository.UserRepository;
import com.example.szoftverfejlesztes_projekt.service.BandService;
import com.example.szoftverfejlesztes_projekt.service.LocationService;
import com.example.szoftverfejlesztes_projekt.service.OpenMicService;
import com.example.szoftverfejlesztes_projekt.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class SzoftverfejlesztesProjektApplicationTests {

    // -------------------------------------------------------------------------
    // Alap teszt – ha ez átmegy, a Spring context legalább el tud indulni.
    // -------------------------------------------------------------------------

    @Test
    @DisplayName("Spring context sikeresen elindul")
    void contextLoads() {
        // itt szándékosan nincs semmi, a cél maga az indulás
    }

    // -------------------------------------------------------------------------
    // Segédmetódusok – teszt adatgyártók
    // -------------------------------------------------------------------------

    private Band createBand(Long id, String name) {
        Band band = new Band();
        band.setBandId(id);
        band.setBandName(name);
        band.setPlayedGenre("rock");
        band.setPhoneNum("123456789");
        band.setEmail(name.toLowerCase() + "@example.com");
        band.setPricePerHour(10_000L);
        band.setAcceptsPercentage(false);
        return band;
    }

    private Location createLocation(Long id, String name) {
        Location loc = new Location();
        loc.setLocationId(id);
        loc.setLocationName(name);
        loc.setPhoneNum("987654321");
        loc.setAddress("Teszt utca 1.");
        loc.setEmail(name.toLowerCase() + "@location.hu");
        // a domainben ez double, úgyhogy itt is számot adunk meg
        loc.setAccomodation(1.0);
        loc.setRentable(true);
        loc.setOpenMic(true);
        loc.setGenrePref("jazz");
        return loc;
    }

    private OpenMicSlot createSlot(Long id,
                                   LocalDateTime start,
                                   LocalDateTime end,
                                   boolean booked,
                                   Band band) {
        OpenMicSlot slot = new OpenMicSlot();
        slot.setId(id);
        slot.setStartTime(start);
        slot.setEndTime(end);
        slot.setBooked(booked);
        slot.setBand(band);
        return slot;
    }

    private OpenMicEvent createEvent(Long id, Location location) {
        OpenMicEvent event = new OpenMicEvent();
        event.setId(id);
        event.setStartTime(LocalDateTime.now().plusDays(1));
        event.setEndTime(LocalDateTime.now().plusDays(1).plusHours(2));
        event.setLocation(location);
        return event;
    }

    private User createUser(Long id, String email, UserRole role, Band band, Location location) {
        User user = new User();
        user.setId(id);
        user.setName("Teszt Elek");
        user.setEmail(email);
        user.setPassword("secret");
        user.setRole(role);
        user.setBand(band);
        user.setLocation(location);
        return user;
    }

    // -------------------------------------------------------------------------
    // BandService unit tesztek – repository mockolása
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("BandService tesztek")
    class BandServiceTests {

        private BandService createServiceWithMocks(BandRepository bandRepository) {
            BandService service = new BandService();
            injectField(service, "bandRepository", bandRepository);
            return service;
        }

        @Test
        @DisplayName("saveBand – a repository save metódusát használja")
        void saveBand_DelegatesToRepository() {
            BandRepository bandRepository = mock(BandRepository.class);
            BandService service = createServiceWithMocks(bandRepository);

            Band toSave = createBand(null, "New Band");
            Band saved = createBand(1L, "New Band");

            when(bandRepository.save(toSave)).thenReturn(saved);

            Band result = service.saveBand(toSave);

            assertNotNull(result);
            assertEquals(1L, result.getBandId());
            assertEquals("New Band", result.getBandName());
            verify(bandRepository, times(1)).save(toSave);
            verifyNoMoreInteractions(bandRepository);
        }

        @Test
        @DisplayName("getAllBands – a repository findAll eredményét adja vissza")
        void getAllBands_ReturnsRepositoryResult() {
            BandRepository bandRepository = mock(BandRepository.class);
            BandService service = createServiceWithMocks(bandRepository);

            List<Band> bands = List.of(
                    createBand(1L, "Band1"),
                    createBand(2L, "Band2")
            );

            when(bandRepository.findAll()).thenReturn(bands);

            List<Band> result = service.getAllBands();

            assertEquals(2, result.size());
            assertEquals("Band1", result.get(0).getBandName());
            assertEquals("Band2", result.get(1).getBandName());
            verify(bandRepository, times(1)).findAll();
        }

        @Test
        @DisplayName("getBandById – ha létezik, visszaadja az entitást")
        void getBandById_WhenExists_ReturnsEntity() {
            BandRepository bandRepository = mock(BandRepository.class);
            BandService service = createServiceWithMocks(bandRepository);

            Band band = createBand(5L, "Existing Band");
            when(bandRepository.findById(5L)).thenReturn(Optional.of(band));

            Band result = service.getBandById(5L);

            assertNotNull(result);
            assertEquals(5L, result.getBandId());
            assertEquals("Existing Band", result.getBandName());
        }

        @Test
        @DisplayName("getBandById – ha nem létezik, null-t ad vissza")
        void getBandById_WhenMissing_ReturnsNull() {
            BandRepository bandRepository = mock(BandRepository.class);
            BandService service = createServiceWithMocks(bandRepository);

            when(bandRepository.findById(99L)).thenReturn(Optional.empty());

            Band result = service.getBandById(99L);

            assertNull(result);
        }

        @Test
        @DisplayName("updateBand – sikeres frissítéskor minden mezőt átvesz")
        void updateBand_WhenExists_UpdatesAllFields() {
            BandRepository bandRepository = mock(BandRepository.class);
            BandService service = createServiceWithMocks(bandRepository);

            Band original = createBand(3L, "Original");
            original.setPlayedGenre("pop");
            original.setPhoneNum("000");
            original.setEmail("old@example.com");
            original.setPricePerHour(1_000L);
            original.setAcceptsPercentage(false);

            Band updated = createBand(null, "Updated");
            updated.setPlayedGenre("metal");
            updated.setPhoneNum("111");
            updated.setEmail("new@example.com");
            updated.setPricePerHour(2_000L);
            updated.setAcceptsPercentage(true);

            when(bandRepository.findById(3L)).thenReturn(Optional.of(original));
            when(bandRepository.save(any(Band.class))).thenAnswer(invocation -> invocation.getArgument(0));

            Band result = service.updateBand(3L, updated);

            assertEquals("Updated", result.getBandName());
            assertEquals("metal", result.getPlayedGenre());
            assertEquals("111", result.getPhoneNum());
            assertEquals("new@example.com", result.getEmail());
            assertEquals(2_000L, result.getPricePerHour());
            assertTrue(result.isAcceptsPercentage());
        }

        @Test
        @DisplayName("updateBand – ha nem létezik az ID, NoSuchElementException dobódik")
        void updateBand_WhenMissing_ThrowsNoSuchElement() {
            BandRepository bandRepository = mock(BandRepository.class);
            BandService service = createServiceWithMocks(bandRepository);

            when(bandRepository.findById(404L)).thenReturn(Optional.empty());

            Band updated = createBand(null, "DoesNotMatter");

            assertThrows(NoSuchElementException.class,
                    () -> service.updateBand(404L, updated));
        }
    }

    // -------------------------------------------------------------------------
    // LocationService unit tesztek
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("LocationService tesztek")
    class LocationServiceTests {

        private LocationService createServiceWithMocks(LocationRepository locationRepository) {
            LocationService service = new LocationService();
            injectField(service, "locationRepository", locationRepository);
            return service;
        }

        @Test
        @DisplayName("saveLocation – simán elmenti az entitást")
        void saveLocation_DelegatesToRepository() {
            LocationRepository locationRepository = mock(LocationRepository.class);
            LocationService service = createServiceWithMocks(locationRepository);

            Location toSave = createLocation(null, "KisPince");
            Location saved = createLocation(1L, "KisPince");

            when(locationRepository.save(toSave)).thenReturn(saved);

            Location result = service.saveLocation(toSave);

            assertEquals(1L, result.getLocationId());
            assertEquals("KisPince", result.getLocationName());
            verify(locationRepository).save(toSave);
        }

        @Test
        @DisplayName("getLocationById – létező ID esetén visszaadja a helyszínt")
        void getLocationById_WhenExists_ReturnsEntity() {
            LocationRepository locationRepository = mock(LocationRepository.class);
            LocationService service = createServiceWithMocks(locationRepository);

            Location location = createLocation(10L, "NagySzínpad");
            when(locationRepository.findById(10L)).thenReturn(Optional.of(location));

            Location result = service.getLocationById(10L);

            assertNotNull(result);
            assertEquals("NagySzínpad", result.getLocationName());
        }

        @Test
        @DisplayName("updateLocation – frissíti az összes fontos mezőt")
        void updateLocation_WhenExists_UpdatesAllFields() {
            LocationRepository locationRepository = mock(LocationRepository.class);
            LocationService service = createServiceWithMocks(locationRepository);

            Location original = createLocation(2L, "Régi Klub");
            original.setPhoneNum("111");
            original.setAddress("Régi utca 1.");
            original.setEmail("old@club.hu");
            original.setAccomodation(0.0);
            original.setRentable(false);
            original.setOpenMic(false);
            original.setGenrePref("rock");

            Location updated = createLocation(null, "Új Klub");
            updated.setPhoneNum("222");
            updated.setAddress("Új utca 2.");
            updated.setEmail("uj@club.hu");
            updated.setAccomodation(2.5);
            updated.setRentable(true);
            updated.setOpenMic(true);
            updated.setGenrePref("metal");

            when(locationRepository.findById(2L)).thenReturn(Optional.of(original));
            when(locationRepository.save(any(Location.class))).thenAnswer(invocation -> invocation.getArgument(0));

            Location result = service.updateLocation(2L, updated);

            assertEquals("Új Klub", result.getLocationName());
            assertEquals("222", result.getPhoneNum());
            assertEquals("Új utca 2.", result.getAddress());
            assertEquals("uj@club.hu", result.getEmail());
            assertEquals(2.5, result.getAccomodation());
            assertTrue(result.isRentable());
            assertTrue(result.isOpenMic());
            assertEquals("metal", result.getGenrePref());
        }

        @Test
        @DisplayName("updateLocation – hiányzó ID esetén NoSuchElementException dobódik")
        void updateLocation_WhenMissing_ThrowsNoSuchElement() {
            LocationRepository locationRepository = mock(LocationRepository.class);
            LocationService service = createServiceWithMocks(locationRepository);

            when(locationRepository.findById(123L)).thenReturn(Optional.empty());

            Location updated = createLocation(null, "DoesNotMatter");

            assertThrows(NoSuchElementException.class,
                    () -> service.updateLocation(123L, updated));
        }
    }

    // -------------------------------------------------------------------------
    // UserService unit tesztek – attachRelations logikával együtt
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("UserService tesztek")
    class UserServiceTests {

        private UserService createServiceWithMocks(UserRepository userRepository,
                                                   BandRepository bandRepository,
                                                   LocationRepository locationRepository) {
            UserService service = new UserService();
            injectField(service, "userRepository", userRepository);
            injectField(service, "bandRepository", bandRepository);
            injectField(service, "locationRepository", locationRepository);
            return service;
        }

        @Test
        @DisplayName("saveUser – attachRelations meghívódik és a repository elmenti")
        void saveUser_AttachesRelationsAndSaves() {
            UserRepository userRepository = mock(UserRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            UserService service = createServiceWithMocks(userRepository, bandRepository, locationRepository);

            Band bandFromDb = createBand(1L, "ExistingBand");
            Location locFromDb = createLocation(2L, "ExistingLoc");

            when(bandRepository.findById(1L)).thenReturn(Optional.of(bandFromDb));
            when(locationRepository.findById(2L)).thenReturn(Optional.of(locFromDb));

            Band bandRef = new Band();
            bandRef.setBandId(1L);
            Location locRef = new Location();
            locRef.setLocationId(2L);

            User user = createUser(null, "user@example.com", UserRole.BAND, bandRef, locRef);
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User u = invocation.getArgument(0);
                u.setId(99L);
                return u;
            });

            User result = service.saveUser(user);

            assertEquals(99L, result.getId());
            assertEquals(bandFromDb, result.getBand());
            assertEquals(locFromDb, result.getLocation());
            verify(bandRepository).findById(1L);
            verify(locationRepository).findById(2L);
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("saveUser – ha a Band ID null, akkor a felhasználó band mezője is null lesz")
        void saveUser_WhenBandIdNull_SetsBandToNull() {
            UserRepository userRepository = mock(UserRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            UserService service = createServiceWithMocks(userRepository, bandRepository, locationRepository);

            User user = createUser(null, "user@example.com", UserRole.LOCATION, null, null);
            // Biztonság kedvéért band objektumot teszünk be ID nélkül
            Band bandRef = new Band();
            user.setBand(bandRef);

            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            User result = service.saveUser(user);

            assertNull(result.getBand());
            verifyNoInteractions(bandRepository);
        }

        @Test
        @DisplayName("saveUser – ha a Location ID null, akkor a location mező null lesz")
        void saveUser_WhenLocationIdNull_SetsLocationToNull() {
            UserRepository userRepository = mock(UserRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            UserService service = createServiceWithMocks(userRepository, bandRepository, locationRepository);

            User user = createUser(null, "user@example.com", UserRole.LOCATION, null, null);
            Location locRef = new Location();
            user.setLocation(locRef);

            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            User result = service.saveUser(user);

            assertNull(result.getLocation());
            verifyNoInteractions(locationRepository);
        }

        @Test
        @DisplayName("updateUser – ha a user létezik, akkor minden mezőt frissít")
        void updateUser_WhenExists_UpdatesFields() {
            UserRepository userRepository = mock(UserRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            UserService service = createServiceWithMocks(userRepository, bandRepository, locationRepository);

            User existing = createUser(1L, "old@example.com", UserRole.BAND, null, null);
            User updated = createUser(null, "new@example.com", UserRole.ADMIN, null, null);
            updated.setPassword("newpass");

            when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            User result = service.updateUser(1L, updated);

            assertEquals("old@example.com", result.getEmail());
            assertEquals("newpass", result.getPassword());
            assertEquals(UserRole.ADMIN, result.getRole());
        }

        @Test
        @DisplayName("updateUser – ha a user hiányzik, NoSuchElementException dobódik")
        void updateUser_WhenMissing_ThrowsNoSuchElement() {
            UserRepository userRepository = mock(UserRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            UserService service = createServiceWithMocks(userRepository, bandRepository, locationRepository);

            when(userRepository.findById(777L)).thenReturn(Optional.empty());

            User updated = createUser(null, "does@not.exist", UserRole.ADMIN, null, null);

            assertThrows(NoSuchElementException.class,
                    () -> service.updateUser(777L, updated));
        }

        @Test
        @DisplayName("exists – továbbítja a hívást a repository existsById metódusára")
        void exists_DelegatesToRepository() {
            UserRepository userRepository = mock(UserRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            UserService service = createServiceWithMocks(userRepository, bandRepository, locationRepository);

            when(userRepository.existsById(1L)).thenReturn(true);
            when(userRepository.existsById(2L)).thenReturn(false);

            assertTrue(service.exists(1L));
            assertFalse(service.exists(2L));

            verify(userRepository).existsById(1L);
            verify(userRepository).existsById(2L);
        }
    }

    // -------------------------------------------------------------------------
    // OpenMicService unit tesztek – slot foglalási logika
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("OpenMicService tesztek")
    class OpenMicServiceTests {

        private OpenMicService createServiceWithMocks(OpenMicSlotRepository slotRepository,
                                                      BandRepository bandRepository,
                                                      OpenMicEventRepository eventRepository,
                                                      LocationRepository locationRepository) {
            OpenMicService service = new OpenMicService();
            injectField(service, "openMicSlotRepository", slotRepository);
            injectField(service, "bandRepository", bandRepository);
            injectField(service, "openMicEventRepository", eventRepository);
            injectField(service, "locationRepository", locationRepository);
            return service;
        }

        @Test
        @DisplayName("bookSlot – sikeres foglalás esetén a slot össze van kötve a band-del")
        void bookSlot_WhenFree_AssignsBandAndMarksAsBooked() {
            OpenMicSlotRepository slotRepository = mock(OpenMicSlotRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            OpenMicEventRepository eventRepository = mock(OpenMicEventRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            OpenMicService service = createServiceWithMocks(slotRepository, bandRepository, eventRepository, locationRepository);

            Band band = createBand(1L, "SlotBand");
            OpenMicSlot slot = createSlot(10L,
                    LocalDateTime.of(2025, 1, 1, 20, 0),
                    LocalDateTime.of(2025, 1, 1, 21, 0),
                    false,
                    null
            );

            when(slotRepository.findById(10L)).thenReturn(Optional.of(slot));
            when(bandRepository.findById(1L)).thenReturn(Optional.of(band));
            when(slotRepository.findConflicts(eq(band), any(LocalDateTime.class), any(LocalDateTime.class)))
                    .thenReturn(Collections.emptyList());

            String message = service.bookSlot(10L, 1L);

            assertTrue(slot.isBooked());
            assertEquals(band, slot.getBand());
            assertNotNull(message);
            assertTrue(message.toLowerCase().contains("booked"));
            verify(slotRepository).save(slot);
        }

        @Test
        @DisplayName("bookSlot – ha a slot nem létezik, NoSuchElementException dobódik")
        void bookSlot_WhenSlotMissing_ThrowsNoSuchElement() {
            OpenMicSlotRepository slotRepository = mock(OpenMicSlotRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            OpenMicEventRepository eventRepository = mock(OpenMicEventRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            OpenMicService service = createServiceWithMocks(slotRepository, bandRepository, eventRepository, locationRepository);

            when(slotRepository.findById(10L)).thenReturn(Optional.empty());

            assertThrows(NoSuchElementException.class,
                    () -> service.bookSlot(10L, 1L));
        }

        @Test
        @DisplayName("bookSlot – ha a band nem létezik, NoSuchElementException dobódik")
        void bookSlot_WhenBandMissing_ThrowsNoSuchElement() {
            OpenMicSlotRepository slotRepository = mock(OpenMicSlotRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            OpenMicEventRepository eventRepository = mock(OpenMicEventRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            OpenMicService service = createServiceWithMocks(slotRepository, bandRepository, eventRepository, locationRepository);

            OpenMicSlot slot = createSlot(10L,
                    LocalDateTime.of(2025, 1, 1, 20, 0),
                    LocalDateTime.of(2025, 1, 1, 21, 0),
                    false,
                    null
            );

            when(slotRepository.findById(10L)).thenReturn(Optional.of(slot));
            when(bandRepository.findById(1L)).thenReturn(Optional.empty());

            assertThrows(NoSuchElementException.class,
                    () -> service.bookSlot(10L, 1L));
        }

        @Test
        @DisplayName("bookSlot – ha a slot már foglalt, IllegalStateException dobódik")
        void bookSlot_WhenAlreadyBooked_ThrowsIllegalState() {
            OpenMicSlotRepository slotRepository = mock(OpenMicSlotRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            OpenMicEventRepository eventRepository = mock(OpenMicEventRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            OpenMicService service = createServiceWithMocks(slotRepository, bandRepository, eventRepository, locationRepository);

            Band band = createBand(1L, "Existing");
            OpenMicSlot slot = createSlot(10L,
                    LocalDateTime.of(2025, 1, 1, 20, 0),
                    LocalDateTime.of(2025, 1, 1, 21, 0),
                    true,
                    band
            );

            when(slotRepository.findById(10L)).thenReturn(Optional.of(slot));
            when(bandRepository.findById(1L)).thenReturn(Optional.of(band));

            assertThrows(IllegalStateException.class,
                    () -> service.bookSlot(10L, 1L));
        }

        @Test
        @DisplayName("bookSlot – ha időkonfliktus van, IllegalStateException dobódik")
        void bookSlot_WhenTimeConflict_ThrowsIllegalState() {
            OpenMicSlotRepository slotRepository = mock(OpenMicSlotRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            OpenMicEventRepository eventRepository = mock(OpenMicEventRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            OpenMicService service = createServiceWithMocks(slotRepository, bandRepository, eventRepository, locationRepository);

            Band band = createBand(1L, "ConflictedBand");
            OpenMicSlot slot = createSlot(10L,
                    LocalDateTime.of(2025, 1, 1, 20, 0),
                    LocalDateTime.of(2025, 1, 1, 21, 0),
                    false,
                    null
            );

            when(slotRepository.findById(10L)).thenReturn(Optional.of(slot));
            when(bandRepository.findById(1L)).thenReturn(Optional.of(band));
            when(slotRepository.findConflicts(eq(band), any(LocalDateTime.class), any(LocalDateTime.class)))
                    .thenReturn(List.of(createSlot(99L,
                            LocalDateTime.of(2025, 1, 1, 20, 30),
                            LocalDateTime.of(2025, 1, 1, 21, 30),
                            true,
                            band)));

            assertThrows(IllegalStateException.class,
                    () -> service.bookSlot(10L, 1L));
        }

        @Test
        @DisplayName("updateEvent – létező event esetén frissíti az időpontokat és a location-t")
        void updateEvent_WhenExists_UpdatesTimesAndLocation() {
            OpenMicSlotRepository slotRepository = mock(OpenMicSlotRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            OpenMicEventRepository eventRepository = mock(OpenMicEventRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            OpenMicService service = createServiceWithMocks(slotRepository, bandRepository, eventRepository, locationRepository);

            Location originalLoc = createLocation(1L, "OldLoc");
            OpenMicEvent existing = createEvent(10L, originalLoc);

            Location newLoc = createLocation(2L, "NewLoc");
            OpenMicEvent updated = createEvent(null, newLoc);
            updated.setStartTime(LocalDateTime.of(2025, 6, 1, 18, 0));
            updated.setEndTime(LocalDateTime.of(2025, 6, 1, 20, 0));

            when(eventRepository.findById(10L)).thenReturn(Optional.of(existing));
            when(locationRepository.findById(2L)).thenReturn(Optional.of(newLoc));
            when(eventRepository.save(any(OpenMicEvent.class))).thenAnswer(invocation -> invocation.getArgument(0));

            OpenMicEvent result = service.updateEvent(10L, updated);

            assertEquals(updated.getStartTime(), result.getStartTime());
            assertEquals(updated.getEndTime(), result.getEndTime());
            assertEquals(newLoc, result.getLocation());
        }

        @Test
        @DisplayName("updateEvent – ha az event hiányzik, NoSuchElementException dobódik")
        void updateEvent_WhenMissing_ThrowsNoSuchElement() {
            OpenMicSlotRepository slotRepository = mock(OpenMicSlotRepository.class);
            BandRepository bandRepository = mock(BandRepository.class);
            OpenMicEventRepository eventRepository = mock(OpenMicEventRepository.class);
            LocationRepository locationRepository = mock(LocationRepository.class);

            OpenMicService service = createServiceWithMocks(slotRepository, bandRepository, eventRepository, locationRepository);

            OpenMicEvent updated = createEvent(null, null);
            when(eventRepository.findById(10L)).thenReturn(Optional.empty());

            assertThrows(NoSuchElementException.class,
                    () -> service.updateEvent(10L, updated));
        }
    }

    // -------------------------------------------------------------------------
    // BandController tesztek – MockMvc-vel
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("BandController tesztek")
    class BandControllerTests {

        private BandController createControllerWithMocks(BandService bandService,
                                                         OpenMicService openMicService) {
            BandController controller = new BandController();
            injectField(controller, "bandService", bandService);
            injectField(controller, "openMicService", openMicService);
            return controller;
        }

        @Test
        @DisplayName("bookSlot endpoint – sikeres foglalás esetén 200 OK és a service üzenete")
        void bookSlotEndpoint_WhenServiceSucceeds_ReturnsOk() throws Exception {
            BandService bandService = mock(BandService.class);
            OpenMicService openMicService = mock(OpenMicService.class);
            BandController controller = createControllerWithMocks(bandService, openMicService);

            when(openMicService.bookSlot(10L, 1L)).thenReturn("Slot successfully booked by TestBand");

            MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

            mockMvc.perform(post("/api/bands/openmic/slots/{slotId}/book/{bandId}", 10L, 1L))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Slot successfully booked by TestBand"));

            verify(openMicService).bookSlot(10L, 1L);
        }

        @Test
        @DisplayName("bookSlot endpoint – NoSuchElementException esetén 404 Not Found")
        void bookSlotEndpoint_WhenNoSuchElement_ReturnsNotFound() throws Exception {
            BandService bandService = mock(BandService.class);
            OpenMicService openMicService = mock(OpenMicService.class);
            BandController controller = createControllerWithMocks(bandService, openMicService);

            when(openMicService.bookSlot(10L, 1L))
                    .thenThrow(new NoSuchElementException("Slot not found"));

            MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

            mockMvc.perform(post("/api/bands/openmic/slots/{slotId}/book/{bandId}", 10L, 1L))
                    .andExpect(status().isNotFound())
                    .andExpect(result -> assertTrue(result.getResolvedException() == null));

            verify(openMicService).bookSlot(10L, 1L);
        }

        @Test
        @DisplayName("bookSlot endpoint – IllegalStateException esetén 400 Bad Request")
        void bookSlotEndpoint_WhenIllegalState_ReturnsBadRequest() throws Exception {
            BandService bandService = mock(BandService.class);
            OpenMicService openMicService = mock(OpenMicService.class);
            BandController controller = createControllerWithMocks(bandService, openMicService);

            when(openMicService.bookSlot(10L, 1L))
                    .thenThrow(new IllegalStateException("Already booked"));

            MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

            mockMvc.perform(post("/api/bands/openmic/slots/{slotId}/book/{bandId}", 10L, 1L))
                    .andExpect(status().isBadRequest());

            verify(openMicService).bookSlot(10L, 1L);
        }
    }

    // -------------------------------------------------------------------------
    // Reflection segédmetódus a privát @Autowired mezők injektálásához
    // -------------------------------------------------------------------------

    private static void injectField(Object target, String fieldName, Object value) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (NoSuchFieldException e) {
            fail("A mező nem található: " + fieldName + " az osztályban: " + target.getClass().getName());
        } catch (IllegalAccessException e) {
            fail("Nem sikerült injektálni a mezőt: " + fieldName + " az osztályban: " + target.getClass().getName());
        }
    }
}
