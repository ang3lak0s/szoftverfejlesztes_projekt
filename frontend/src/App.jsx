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
import LocationClientPage from "./LocationClientPage";

export default function App() {
  const [mode, setMode] = useState("main");
  const [view, setView] = useState("home");

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
              annak ellenére, hogy örülünk, ha csütörtökön megjelenik valami a képernyőn.
            </p>
            <p style={{ marginTop: "16px", fontStyle: "italic" }}>
              „Ezt az alkalmazást Arnóczki Áron emlékére fejlesztettük, szívünkben
              örökké él (Fel kéne tolni valamit Githubra főnök!).”
            </p>
          </div>

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
    return <LocationClientPage onBack={() => setMode("main")} />;
  }

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
