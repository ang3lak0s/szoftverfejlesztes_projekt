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

      if (!res.ok) throw new Error(text || "Foglalási hiba");

      setMessage(text || "Sikeres foglalás");
      await loadSlots();
    } catch (e) {
      setError(e.message || "Ismeretlen hiba foglalás közben");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div
          style={{
            padding: 20,
            fontFamily: "sans-serif",
            background: "#111",
            color: "white",
            minHeight: "100vh",
          }}
      >
        {/* Vissza gomb */}
        <button
            onClick={onBack}
            style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                color: "white",
                cursor: "pointer",
                marginBottom: "20px",
                display: "inline-block",
                fontFamily: "sans-serif",
                position: "absolute",
                top: "20px",
                left: "20px",
                zIndex: 1000
            }}
        >
          ← Vissza
        </button>

        {/* Fejléc */}
        <h1 style={{ fontSize: "36px", marginBottom: "8px", textAlign: "center"}}>Banda felület</h1>

        {/* Üzenetek */}
        {loading && <p>Betöltés / művelet folyamatban…</p>}
        {message && <p style={{ color: "lightgreen" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Open Mic slotok */}
        <h2 style={{ marginBottom: "12px" }}>Open Mic slotok</h2>
        <table
            border="1"
            cellPadding="6"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
        >
          <thead>
          <tr style={{ backgroundColor: "#333" }}>
            <th>ID</th>
            <th>Kezdés</th>
            <th>Befejezés</th>
            <th>Foglalt?</th>
            <th>Művelet</th>
          </tr>
          </thead>
          <tbody>
          {slots.map((s) => (
              <tr
                  key={s.id}
                  style={{
                    backgroundColor: s.booked ? "#444" : "#222",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#555")
                  }
                  onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = s.booked ? "#444" : "#222")
                  }
              >
                <td>{s.id}</td>
                <td>{s.startTime}</td>
                <td>{s.endTime}</td>
                <td>{s.booked ? "Igen" : "Nem"}</td>
                <td>
                  {!s.booked ? (
                      <button
                          onClick={() => handleBook(s.id)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            backgroundColor: "#4caf50",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                          }}
                      >
                        Foglalás
                      </button>
                  ) : (
                      <span style={{ color: "#ccc" }}>Nem foglalható</span>
                  )}
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}
