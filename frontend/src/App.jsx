import { useState } from "react";
import BandCrud from "./BandCrud";

function App() {
  const [view, setView] = useState("home");
  const [bands, setBands] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBands = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await fetch("/api/bands");
      if (!res.ok) {
        throw new Error("Meghalt az összes banda, Isten nyugasztalja, temetés jövőhét kedden, 14 órakor");
      }
      const data = await res.json();
      setBands(data);
      setView("bands");
    } catch (err) {
      setError(err.message || "Valami félrement kisöreg");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await fetch("/api/locations");
      if (!res.ok) {
        throw new Error("Felrobbant az összes helyszín, a feléért kár, a többinek meg hamarabb kellett volna");
      }
      const data = await res.json();
      setLocations(data);
      setView("locations");
    } catch (err) {
      setError(err.message || "Valami félrement kisöreg");
    } finally {
      setLoading(false);
    }
  };

  const loadFullBands = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await fetch("/api/bands");
      if (!res.ok) {
        throw new Error("Nem sikerült lekérni a bandákat");
      }
      const data = await res.json();
      setBands(data);
      setView("fullBands");
    } catch (err) {
      setError(err.message || "Ismeretlen hiba történt");
    } finally {
      setLoading(false);
    }
  };


  const goHome = () => {
    setView("home");
    setError("");
  };

  if (view === "bands") {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <button onClick={goHome}>← Vissza</button>
        <h1>Bandák</h1>
        {loading && <p>Betöltés…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
          {bands.map((band) => (
            <li key={band.bandId}>{band.bandName}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (view === "locations") {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <button onClick={goHome}>Vissza</button>
        <h1>Helyszínek</h1>
        {loading && <p>Betöltés…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
          {locations.map((loc) => (
            <li key={loc.locationId}>{loc.locationName}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (view === "fullBands") {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <button onClick={goHome}>← Vissza</button>
        <h1>Bandák – teljes adatok</h1>
        {loading && <p>Betöltés…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <table border="1" cellPadding="8" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Név</th>
              <th>Műfaj</th>
              <th>Telefon</th>
              <th>E-mail</th>
              <th>Ár / óra</th>
              <th>Elfogad %-ot?</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {bands.map((b) => (
              <tr key={b.bandId}>
                <td>{b.bandId}</td>
                <td>{b.bandName}</td>
                <td>{b.playedGenre}</td>
                <td>{b.phoneNum}</td>
                <td>{b.email}</td>
                <td>{b.pricePerHour}</td>
                <td>{b.acceptsPercentage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (view === "bandCrud") {
    return <BandCrud onBack={() => setView("home")} />;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Zenekar–Helyszín rendszer</h1>
      <p>Melyik pirulát választod?:</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={loadBands}>Bandák listázása</button>
        <button onClick={loadLocations}>Helyszínek listázása</button>
        <button onClick={loadFullBands}>Bandák (teljes adatok)</button>
        <button onClick={() => setView("bandCrud")}>Bandák CRUD</button>
      </div>
    </div>
  );
}

export default App;
