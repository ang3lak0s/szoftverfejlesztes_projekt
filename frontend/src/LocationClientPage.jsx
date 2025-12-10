import { useEffect, useState } from "react";

export default function LocationClientPage({ onBack }) {
    const locationId = 1;

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Új slot state-jei
    const [newStart, setNewStart] = useState("");
    const [newEnd, setNewEnd] = useState("");

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

    // ÚJ SLOT FELVITELE az anyádat
    const handleAddSlot = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        try {
            const res = await fetch(`/api/openmic`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    startTime: newStart,
                    endTime: newEnd,
                    location: { locationId: locationId }
                }),
            });

            if (!res.ok) throw new Error("Az új időpont hozzáadása sikertelen");

            setMessage("Új Open Mic időpont sikeresen felvéve!");
            setNewStart("");
            setNewEnd("");

            await loadSlots();
        } catch (e) {
            setError(e.message || "Ismeretlen hiba");
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
            {/* Vissza */}
            <button
                onClick={onBack}
                style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    //color: "white",
                    cursor: "pointer",
                    display: "inline-block",
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    zIndex: 1000,
                }}
            >
                ← Vissza
            </button>

            <h1 style={{ fontSize: "36px", marginBottom: "8px" }}>
                <div style={{ textAlign: "center" }}>Helyszín felület</div>
            </h1>

            {loading && <p>Betöltés / művelet folyamatban…</p>}
            {message && <p style={{ color: "lightgreen" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Új slot form */}
            <h2>Új Open Mic időpont felvétele</h2>

            <form
                onSubmit={handleAddSlot}
                style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                    marginBottom: 30,
                    background: "#222",
                    padding: "15px",
                    borderRadius: "8px",
                }}
            >
                <div>
                    <label>Kezdés:</label>
                    <br />
                    <input
                        type="datetime-local"
                        value={newStart}
                        onChange={(e) => setNewStart(e.target.value)}
                        required
                        style={{ padding: 6, borderRadius: 6 }}
                    />
                </div>

                <div>
                    <label>Befejezés:</label>
                    <br />
                    <input
                        type="datetime-local"
                        value={newEnd}
                        onChange={(e) => setNewEnd(e.target.value)}
                        required
                        style={{ padding: 6, borderRadius: 6 }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        padding: "10px 18px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        background: "#444",
                        color: "white",
                    }}
                >
                    + Hozzáadás
                </button>
            </form>

            {/* Slot lista */}
            <h2>Saját Open Mic slotjaim</h2>
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
                    <th>Foglaló banda</th>
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
                            (e.currentTarget.style.backgroundColor = s.booked
                                ? "#444"
                                : "#222")
                        }
                    >
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
