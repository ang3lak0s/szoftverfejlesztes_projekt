import { useEffect, useState } from "react";

export default function LocationClientPage({ onBack }) {
  const locationId = 1;

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/locations/${locationId}/slots`);
      if (!res.ok) throw new Error("Nem sikerült lekérni a slotokat");
      const data = await res.json();
      setSlots(data);
    } catch (e) {
      setError(e.message || "Ismeretlen hiba");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack}>← Vissza a főoldalra</button>
      <h1>Helyszín felület</h1>
      <p>(Ideiglenesen az 1-es ID-jú helyszín van „bejelentkezve”.)</p>

      {loading && <p>Betöltés...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Saját Open Mic slotjaim</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Kezdés</th>
            <th>Befejezés</th>
            <th>Foglalt?</th>
            <th>Foglaló banda</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.startTime}</td>
              <td>{s.endTime}</td>
              <td>{s.booked ? "Igen" : "Nem"}</td>
              <td>{s.band ? s.band.bandName : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
