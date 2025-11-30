import { useEffect, useState } from "react";

export default function OpenMicEventCrud({ onBack }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    id: null,
    startTime: "",
    endTime: "",
    location: null
  });

  const isEdit = form.id !== null;

  const loadEvents = async () => {
    const res = await fetch("/api/openmic");
    setEvents(await res.json());
  };

  useEffect(() => { loadEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location
        ? { locationId: Number(form.location) }
        : null
    };

    const url = isEdit ? `/api/openmic/${form.id}` : "/api/openmic";
    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    setForm({ id: null, startTime: "", endTime: "", location: null });
    loadEvents();
  };

  const handleEdit = (ev) => {
    setForm({
      id: ev.id,
      startTime: ev.startTime,
      endTime: ev.endTime,
      location: ev.location?.locationId || null
    });
  };

  const handleDelete = async (id) => {
    await fetch(`/api/openmic/${id}`, { method: "DELETE" });
    loadEvents();
  };

  return (
    <div>
      <button onClick={onBack}>Vissza</button>
      <h1>Open Mic CRUD</h1>

      {/* Lista */}
      <table>
        <thead>
        <tr>
          <th>ID</th><th>Kezdés</th><th>Befejezés</th><th>Helyszín</th><th></th>
        </tr>
        </thead>
        <tbody>
        {events.map(ev => (
          <tr key={ev.id}>
            <td>{ev.id}</td>
            <td>{ev.startTime}</td>
            <td>{ev.endTime}</td>
            <td>{ev.location?.locationName}</td>
            <td>
              <button onClick={() => handleEdit(ev)}>Szerkesztés</button>
              <button onClick={() => handleDelete(ev.id)}>Törlés</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {/* Form */}
      <h2>{isEdit ? "Szerkesztés" : "Új hozzáadása"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="datetime-local"
          value={form.startTime}
          onChange={e => setForm({ ...form, startTime: e.target.value })}
          required
        />

        <input
          type="datetime-local"
          value={form.endTime}
          onChange={e => setForm({ ...form, endTime: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Location ID"
          value={form.location || ""}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />

        <button type="submit">{isEdit ? "Mentés" : "Hozzáadás"}</button>
      </form>
    </div>
  );
}
