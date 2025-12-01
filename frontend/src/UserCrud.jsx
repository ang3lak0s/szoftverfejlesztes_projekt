import { useEffect, useState } from "react";

export default function UserCrud({ onBack }) {
  const [users, setUsers] = useState([]);
  const [bands, setBands] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "BAND",
    bandId: "",
    locationId: "",
  });

  const isEdit = form.id !== null;

  const loadUsers = async () => {
    const res = await fetch("/api/users");
    if (!res.ok) throw new Error("Nem sikerült lekérni a usereket");
    setUsers(await res.json());
  };

  const loadBands = async () => {
    const res = await fetch("/api/bands");
    if (!res.ok) throw new Error("Nem sikerült lekérni a bandákat");
    setBands(await res.json());
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
        await Promise.all([loadUsers(), loadBands(), loadLocations()]);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      email: "",
      password: "",
      role: "BAND",
      bandId: "",
      locationId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const body = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      band:
        form.role === "BAND" && form.bandId
          ? { bandId: Number(form.bandId) }
          : null,
      location:
        form.role === "LOCATION" && form.locationId
          ? { locationId: Number(form.locationId) }
          : null,
    };

    const url = isEdit ? `/api/users/${form.id}` : "/api/users";
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

    resetForm();
    await loadUsers();
  };

  const handleEdit = (u) => {
    setForm({
      id: u.id,
      name: u.name ?? "",
      email: u.email ?? "",
      password: u.password ?? "",
      role: u.role ?? "BAND",
      bandId: u.band?.bandId ?? "",
      locationId: u.location?.locationId ?? "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztos törlöd ezt a usert?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Sikertelen törlés");
      return;
    }
    await loadUsers();
  };

  return (
    <div style={{ padding: 20 }}>
      {onBack && <button onClick={onBack}>← Vissza</button>}
      <h1>Userek – CRUD</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Lista</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Email</th>
            <th>Szerep</th>
            <th>Banda</th>
            <th>Helyszín</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.band?.bandName || "-"}</td>
              <td>{u.location?.locationName || "-"}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Szerkesztés</button>{" "}
                <button onClick={() => handleDelete(u.id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{isEdit ? "User szerkesztése" : "Új user hozzáadása"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 360 }}
      >
        <label>
          Név:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Jelszó:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Szerep:
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="BAND">BAND</option>
            <option value="LOCATION">LOCATION</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        {form.role === "BAND" && (
          <label>
            Banda:
            <select
              name="bandId"
              value={form.bandId}
              onChange={handleChange}
            >
              <option value="">-- válassz bandát --</option>
              {bands.map((b) => (
                <option key={b.bandId} value={b.bandId}>
                  {b.bandName} (ID: {b.bandId})
                </option>
              ))}
            </select>
          </label>
        )}

        {form.role === "LOCATION" && (
          <label>
            Helyszín:
            <select
              name="locationId"
              value={form.locationId}
              onChange={handleChange}
            >
              <option value="">-- válassz helyszínt --</option>
              {locations.map((l) => (
                <option key={l.locationId} value={l.locationId}>
                  {l.locationName} (ID: {l.locationId})
                </option>
              ))}
            </select>
          </label>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">{isEdit ? "Mentés" : "Hozzáadás"}</button>
          {isEdit && (
            <button type="button" onClick={resetForm}>
              Mégse
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
