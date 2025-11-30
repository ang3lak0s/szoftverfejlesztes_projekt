import { useEffect, useState } from "react";

export default function UserCrud({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
  });

  const isEdit = form.id !== null;

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Nem sikerült lekérni a usereket");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      setError(e.message || "Ismeretlen hiba a userek lekérésekor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      const body = {
        name: form.name,
        email: form.email,
      };

      let res;
      if (isEdit) {
        res = await fetch(`/api/users/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        throw new Error(
          `Sikertelen mentés (${res.status} - ${res.statusText})`
        );
      }

      await loadUsers();
      setForm({ id: null, name: "", email: "" });
    } catch (e) {
      setError(e.message || "Ismeretlen hiba mentés közben");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (u) => {
    setForm({
      id: u.id,
      name: u.name || "",
      email: u.email || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztos törlöd ezt a usert?")) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error("Nem sikerült törölni a usert");
      }
      await loadUsers();
    } catch (e) {
      setError(e.message || "Ismeretlen hiba törlés közben");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({ id: null, name: "", email: "" });
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <button onClick={onBack}>← Vissza főoldalra</button>
      <h1>Userek – CRUD</h1>

      {loading && <p>Betöltés / művelet folyamatban…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Lista</h2>
      <table border="1" cellPadding="6" style={{ marginBottom: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>E-mail</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Szerkesztés</button>{" "}
                <button onClick={() => handleDelete(u.id)}>Törlés</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{isEdit ? "User szerkesztése" : "Új user felvétele"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 320 }}
      >
        <div>
          <label>
            Név:
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            E-mail:
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">
            {isEdit ? "Mentés" : "Hozzáadás"}
          </button>
          {isEdit && (
            <button type="button" onClick={handleCancelEdit}>
              Mégse
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
