import { useEffect, useState } from "react";

export default function OpenMicSlotCrud({ onBack }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    startTime: "",
    endTime: "",
    booked: false,
    eventId: "",
  });

  const isEdit = form.id !== null;

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/slots");
      if (!res.ok) throw new Error("Nem sikerült lekérni a slotokat");
      const data = await res.json();
      setSlots(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      startTime: form.startTime,
      endTime: form.endTime,
      booked: form.booked,
      event: form.eventId
        ? { id: Number(form.eventId) }
        : null,
    };

    const url = isEdit ? `/api/slots/${form.id}` : "/api/slots";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Sikertelen mentés");
      await loadSlots();
      setForm({
        id: null,
        startTime: "",
        endTime: "",
        booked: false,
        eventId: "",
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slot) => {
    setForm({
      id: slot.id,
      startTime: slot.startTime || "",
      endTime: slot.endTime || "",
      booked: slot.booked ?? false,
      eventId: slot.event?.id || "", // ⬅ ha a backend küldi vissza az eventet
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztos törlöd ezt a slotot?")) return;
    await fetch(`/api/slots/${id}`, { method: "DELETE" });
    loadSlots();
  };

  const handleCancel = () => {
    setForm({
      id: null,
      startTime: "",
      endTime: "",
      booked: false,
      eventId: "",
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack}>← Vissza</button>
      <h1>Open Mic Slot – CRUD</h1>

      {loading && <p>Betöltés...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Slot lista</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Kezdés</th>
            <th>Befejezés</th>
            <th>Foglalt?</th>
            <th>Event ID</th>
            <th>Helyszín</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.startTime}</td>
              <td>{s.endTime}</td>
              <td>{s.booked ? "Igen" : "Nem"}</td>
              <td>{s.event ? s.event.id : "-"}</td>
              <td>
                {s.event && s.event.location
                  ? s.event.location.locationName
                  : "-"}
              </td>
              <td>
                <button onClick={() => handleEdit(s)}>Szerkesztés</button>{" "}
                <button onClick={() => handleDelete(s.id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{isEdit ? "Slot szerkesztése" : "Új slot"}</h2>
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
          Foglalt?
          <input
            type="checkbox"
            name="booked"
            checked={form.booked}
            onChange={handleChange}
          />
        </label>

        <label>
          Event ID:
          <input
            type="number"
            name="eventId"
            value={form.eventId}
            onChange={handleChange}
            placeholder="kapcsolódó event ID"
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">{isEdit ? "Mentés" : "Hozzáadás"}</button>
          {isEdit && (
            <button type="button" onClick={handleCancel}>
              Mégse
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
