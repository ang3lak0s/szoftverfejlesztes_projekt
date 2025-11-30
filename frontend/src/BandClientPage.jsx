import { useEffect, useState } from "react";

export default function BandClientPage({ onBack }) {
  const bandId = 1;

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/slots");
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

  const handleBook = async (slotId) => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(
        `/api/bands/openmic/slots/${slotId}/book/${bandId}`,
        { method: "POST" }
      );

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Foglalási hiba");
      }

      setMessage(text || "Sikeres foglalás");
      await loadSlots(); // frissítjük a listát
    } catch (e) {
      setError(e.message || "Ismeretlen hiba foglalás közben");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack}>← Vissza a főoldalra</button>
      <h1>Banda felület</h1>
      <p>(Ideiglenesen az 1-es ID-jú banda van „bejelentkezve”.)</p>

      {loading && <p>Betöltés / művelet folyamatban…</p>}
      {message && <p style={{ color: "lightgreen" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Open Mic slotok</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Kezdés</th>
            <th>Befejezés</th>
            <th>Foglalt?</th>
            <th>Művelet</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.startTime}</td>
              <td>{s.endTime}</td>
              <td>{s.booked ? "Igen" : "Nem"}</td>
              <td>
                {!s.booked ? (
                  <button onClick={() => handleBook(s.id)}>Foglalás</button>
                ) : (
                  <span>Nem foglalható</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
