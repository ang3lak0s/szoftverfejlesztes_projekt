// frontend/src/BandCrud.jsx

import { useEffect, useState } from "react";

export default function BandCrud({ onBack }) {
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    bandId: null,
    bandName: "",
    playedGenre: "",
    phoneNum: "",
    email: "",
    pricePerHour: "",
    acceptsPercentage: false,
  });

  const isEdit = form.bandId !== null;

  const loadBands = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/bands");
      if (!res.ok) throw new Error("Nem sikerült lekérni a bandákat");
      const data = await res.json();
      setBands(data);
    } catch (e) {
      setError(e.message || "Ismeretlen hiba a bandák lekérésekor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBands();
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
    try {
      setError("");
      setLoading(true);

      const body = {
        bandName: form.bandName,
        playedGenre: form.playedGenre,
        phoneNum: form.phoneNum,
        email: form.email,
        pricePerHour: form.pricePerHour
          ? Number(form.pricePerHour)
          : null,
        acceptsPercentage: form.acceptsPercentage,
      };

      let res;
      if (isEdit) {
        res = await fetch(`/api/bands/${form.bandId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/bands", {
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

      await loadBands();
      setForm({
        bandId: null,
        bandName: "",
        playedGenre: "",
        phoneNum: "",
        email: "",
        pricePerHour: "",
        acceptsPercentage: false,
      });
    } catch (e) {
      setError(e.message || "Ismeretlen hiba mentés közben");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (band) => {
    setForm({
      bandId: band.bandId,
      bandName: band.bandName || "",
      playedGenre: band.playedGenre || "",
      phoneNum: band.phoneNum || "",
      email: band.email || "",
      pricePerHour: band.pricePerHour ?? "",
      acceptsPercentage: band.acceptsPercentage ?? false,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztos törlöd ezt a bandát?")) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/bands/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error("Nem sikerült törölni a bandát");
      }
      await loadBands();
    } catch (e) {
      setError(e.message || "Ismeretlen hiba törlés közben");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      bandId: null,
      bandName: "",
      playedGenre: "",
      phoneNum: "",
      email: "",
      pricePerHour: "",
      acceptsPercentage: false,
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <button onClick={onBack}>← Vissza főoldalra</button>
      <h1>Bandák – CRUD</h1>

      {loading && <p>Betöltés / művelet folyamatban…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Lista</h2>
      <table border="1" cellPadding="6" style={{ marginBottom: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Műfaj</th>
            <th>Telefon</th>
            <th>E-mail</th>
            <th>Ár / óra</th>
            <th>Elfogad %-ot?</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {bands.map((b) => (
            <tr key={b.bandId}>
              <td>{b.bandId}</td>
              <td>{b.bandName}</td>
              <td>{b.playedGenre}</td>
              <td>{b.phoneNum}</td>
              <td>{b.email}</td>
              <td>{b.pricePerHour}</td>
              <td>{b.acceptsPercentage ? "Igen" : "Nem"}</td>
              <td>
                <button onClick={() => handleEdit(b)}>Szerkesztés</button>{" "}
                <button onClick={() => handleDelete(b.bandId)}>
                  Törlés
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{isEdit ? "Banda szerkesztése" : "Új banda felvétele"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 320 }}
      >
        <div>
          <label>
            Név:
            <input
              name="bandName"
              value={form.bandName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Műfaj:
            <input
              name="playedGenre"
              value={form.playedGenre}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Telefon:
            <input
              name="phoneNum"
              value={form.phoneNum}
              onChange={handleChange}
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
            />
          </label>
        </div>
        <div>
          <label>
            Ár / óra (HUF):
            <input
              name="pricePerHour"
              type="number"
              value={form.pricePerHour}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Elfogad %-os fizetést?
            <input
              name="acceptsPercentage"
              type="checkbox"
              checked={form.acceptsPercentage}
              onChange={handleChange}
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
