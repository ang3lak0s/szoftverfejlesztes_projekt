import { useState } from "react";
import BandCrud from "./BandCrud";
import LocationCrud from "./LocationCrud";
import UserCrud from "./UserCrud";
import OpenMicEventCrud from "./OpenMicEventCrud";
import OpenMicSlotCrud from "./OpenMicSlotCrud";
import BandList from "./BandList";
import LocationList from "./LocationList";
import FullBandList from "./FullBandList";
import BandClientPage from "./BandClientPage";

export default function App() {
  // külső szint: main page vs admin felület
  const [mode, setMode] = useState("main");
  // belső szint: adminon belüli nézet
  const [view, setView] = useState("home");

  // 1) MAIN PAGE – 3 gomb: banda / helyszín / admin
  if (mode === "main") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111",
          color: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Felső sáv – logó helye, belépés */}
        <header
          style={{
            display: "flex",
            borderBottom: "1px solid #333",
            padding: "16px",
            alignItems: "center",
          }}
        >
          <div style={{ marginRight: "16px", fontWeight: "bold" }}>Belépés</div>
          <div style={{ flex: 1, textAlign: "center", fontSize: "24px" }}>
            Logó helye
          </div>
        </header>

        {/* Középső rész – hype szöveg, vicc, stb. */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div>
            <h1>Zenekar–Helyszín Rendszer</h1>
            <p>
              Tipikus kis hype szöveg, hogy mennyire jó ez az alkalmazás,
              annak ellenére, hogy mindenki tudja, hogy ez egy iskolai projekt. 😄
            </p>
            <p style={{ marginTop: "16px", fontStyle: "italic" }}>
              „Ezt az alkalmazást annak a fejlesztőnek ajánljuk, aki meghalt a
              projekt során (nem halt meg, csak lusta volt).”
            </p>
          </div>

          {/* 3 nagy gomb */}
          <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            <button
              onClick={() => setMode("band")}
              style={{ padding: "12px 24px", borderRadius: "8px" }}
            >
              Banda vagyok
            </button>
            <button
              onClick={() => setMode("location")}
              style={{ padding: "12px 24px", borderRadius: "8px" }}
            >
              Helyszín vagyok
            </button>
            <button
              onClick={() => {
                setMode("admin");
                setView("home");
              }}
              style={{ padding: "12px 24px", borderRadius: "8px" }}
            >
              Admin vagyok
            </button>
          </div>
        </main>

        {/* Alsó sáv – közelgő események placeholder */}
        <footer
          style={{
            borderTop: "1px solid #333",
            padding: "16px",
            textAlign: "center",
          }}
        >
          Közelgő események / valami hasonló helye
        </footer>
      </div>
    );
  }

  if (mode === "band") {
    return <BandClientPage onBack={() => setMode("main")} />;
  }


  if (mode === "location") {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => setMode("main")}>← Vissza a főoldalra</button>
        <h1>Helyszín felület (fejlesztés alatt)</h1>
        <p>Itt majd a helyszín a saját eseményeit, foglalásait kezeli.</p>
      </div>
    );
  }

  // 3) ADMIN MÓD – ide jön a mostani layoutod (második kép)

  // admin "home" – a jelenlegi kezdőképernyőd gombokkal
  if (mode === "admin" && view === "home") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111",
          color: "white",
          padding: "24px",
        }}
      >
        <button
          onClick={() => setMode("main")}
          style={{ marginBottom: "16px" }}
        >
          ← Kilépés az admin felületről
        </button>

        <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>
          Zenekar–Helyszín rendszer
        </h1>

        <p style={{ marginBottom: "16px" }}>Melyik pirulát választod?</p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={() => setView("bands")}>Bandák listázása</button>
          <button onClick={() => setView("locations")}>
            Helyszínek listázása
          </button>
          <button onClick={() => setView("fullBands")}>
            Bandák (teljes adatok)
          </button>
          <button onClick={() => setView("bandCrud")}>Bandák CRUD</button>
          <button onClick={() => setView("locationCrud")}>
            Helyszínek CRUD
          </button>
          <button onClick={() => setView("userCrud")}>Userek CRUD</button>
          <button onClick={() => setView("eventCrud")}>
            Open Mic Event CRUD
          </button>
          <button onClick={() => setView("slotCrud")}>
            Open Mic Slot CRUD
          </button>
        </div>
      </div>
    );
  }

  // innen lefelé ugyanúgy, ahogy eddig: a CRUD oldalak
  if (mode === "admin" && view === "bandCrud") {
    return <BandCrud onBack={() => setView("home")} />;
  }

  if (mode === "admin" && view === "locationCrud") {
    return <LocationCrud onBack={() => setView("home")} />;
  }

  if (mode === "admin" && view === "userCrud") {
    return <UserCrud onBack={() => setView("home")} />;
  }

  if (mode === "admin" && view === "eventCrud") {
    return <OpenMicEventCrud onBack={() => setView("home")} />;
  }

  if (mode === "admin" && view === "slotCrud") {
    return <OpenMicSlotCrud onBack={() => setView("home")} />;
  }

  if (mode === "admin" && view === "bands") {
    return <BandList />;
  }

  if (mode === "admin" && view === "locations") {
    return <LocationList />;
  }

  if (mode === "admin" && view === "fullBands") {
    return <FullBandList />;
  }

  return <div>A hívott szám jelenleg nem elérhető, üzenetét hagyja meg a sípszó után *pííííp*</div>;
}
