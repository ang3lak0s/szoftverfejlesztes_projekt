import { useEffect, useState } from "react";

export default function OpenMicEventCrud({ onBack }) {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);

  const [form, setForm] = useState({
    id: null,
    startTime: "",
    endTime: "",
    locationId: "",
  });

  const [error, setError] = useState("");
  const isEdit = form.id !== null;

  const loadEvents = async () => {
    const res = await fetch("/api/openmic");
    if (!res.ok) throw new Error("Nem sikerült lekérni az eseményeket");
    setEvents(await res.json());
  };

  const loadLocations = async () => {
    const res = await fetch("/api/locations");
    if (!res.ok) throw new Error("Nem sikerült lekérni a helyszíneket");
    setLocations(await res.json());
  };

  useEffect(() => {
    (async () => {
      try {
        setError("");
        await Promise.all([loadEvents(), loadLocations()]);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const body = {
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.locationId
        ? { locationId: Number(form.locationId) }
        : null,
    };

    const url = isEdit ? `/api/openmic/${form.id}` : "/api/openmic";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setError("Sikertelen mentés");
      return;
    }

    setForm({
      id: null,
      startTime: "",
      endTime: "",
      locationId: "",
    });
    await loadEvents();
  };

  const handleEdit = (ev) => {
    setForm({
      id: ev.id,
      startTime: ev.startTime,
      endTime: ev.endTime,
      locationId: ev.location?.locationId || "",
    });
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/openmic/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Sikertelen törlés");
      return;
    }
    loadEvents();
  };

  return (
    <div>
      <button onClick={onBack}>Vissza</button>
      <h1>Open Mic események – CRUD</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lista */}
      <h2>Események</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Kezdés</th>
            <th>Befejezés</th>
            <th>Helyszín</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id}>
              <td>{ev.id}</td>
              <td>{ev.startTime}</td>
              <td>{ev.endTime}</td>
              <td>{ev.location?.locationName || "-"}</td>
              <td>
                <button onClick={() => handleEdit(ev)}>Szerkesztés</button>{" "}
                <button onClick={() => handleDelete(ev.id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form */}
      <h2>{isEdit ? "Esemény szerkesztése" : "Új esemény hozzáadása"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 320 }}
      >
        <label>
          Kezdés:
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Befejezés:
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Helyszín:
          <select
            name="locationId"
            value={form.locationId}
            onChange={handleChange}
          >
            <option value="">-- válassz helyszínt --</option>
            {locations.map((loc) => (
              <option key={loc.locationId} value={loc.locationId}>
                {loc.locationName} (ID: {loc.locationId})
              </option>
            ))}
          </select>
        </label>

        <button type="submit">{isEdit ? "Mentés" : "Hozzáadás"}</button>
      </form>
    </div>
  );
}
