import { useState } from "react";

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

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Zenekar–Helyszín rendszer</h1>
      <p>Melyik pirulát választod?:</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={loadBands}>Bandák listázása</button>
        <button onClick={loadLocations}>Helyszínek listázása</button>
      </div>
    </div>
  );
}

export default App;
