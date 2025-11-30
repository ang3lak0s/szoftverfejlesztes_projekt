import { useEffect, useState } from "react";

export default function LocationCrud({ onBack }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    locationId: null,
    locationName: "",
    phoneNum: "",
    address: "",
    email: "",
    accomodation: "",
    rentable: false,
    openMic: false,
    genrePref: "",
  });

  const isEdit = form.locationId !== null;

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/locations");
      if (!res.ok) throw new Error("Nem sikerült lekérni a helyszíneket");
      const data = await res.json();
      setLocations(data);
    } catch (e) {
      setError(e.message || "Ismeretlen hiba a helyszínek lekérésekor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
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
        locationName: form.locationName,
        phoneNum: form.phoneNum,
        address: form.address,
        email: form.email,
        accomodation: form.accomodation ? Number(form.accomodation) : 0,
        rentable: form.rentable,
        openMic: form.openMic,
        genrePref: form.genrePref,
      };

      let res;
      if (isEdit) {
        res = await fetch(`/api/locations/${form.locationId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/locations", {
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

      await loadLocations();
      setForm({
        locationId: null,
        locationName: "",
        phoneNum: "",
        address: "",
        email: "",
        accomodation: "",
        rentable: false,
        openMic: false,
        genrePref: "",
      });
    } catch (e) {
      setError(e.message || "Ismeretlen hiba mentés közben");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (loc) => {
    setForm({
      locationId: loc.locationId,
      locationName: loc.locationName || "",
      phoneNum: loc.phoneNum || "",
      address: loc.address || "",
      email: loc.email || "",
      accomodation: loc.accomodation ?? "",
      rentable: loc.rentable ?? false,
      openMic: loc.openMic ?? false,
      genrePref: loc.genrePref || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Biztos törlöd ezt a helyszínt?")) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/locations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error("Nem sikerült törölni a helyszínt");
      }
      await loadLocations();
    } catch (e) {
      setError(e.message || "Ismeretlen hiba törlés közben");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      locationId: null,
      locationName: "",
      phoneNum: "",
      address: "",
      email: "",
      accomodation: "",
      rentable: false,
      openMic: false,
      genrePref: "",
    });
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <button onClick={onBack}>← Vissza főoldalra</button>
      <h1>Helyszínek – CRUD</h1>

      {loading && <p>Betöltés / művelet folyamatban…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Lista</h2>
      <table border="1" cellPadding="6" style={{ marginBottom: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Telefon</th>
            <th>Cím</th>
            <th>E-mail</th>
            <th>Szállás (accomodation)</th>
            <th>Bérelhető?</th>
            <th>Open Mic?</th>
            <th>Preferált műfaj</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc.locationId}>
              <td>{loc.locationId}</td>
              <td>{loc.locationName}</td>
              <td>{loc.phoneNum}</td>
              <td>{loc.address}</td>
              <td>{loc.email}</td>
              <td>{loc.accomodation}</td>
              <td>{loc.rentable ? "Igen" : "Nem"}</td>
              <td>{loc.openMic ? "Igen" : "Nem"}</td>
              <td>{loc.genrePref}</td>
              <td>
                <button onClick={() => handleEdit(loc)}>Szerkesztés</button>{" "}
                <button onClick={() => handleDelete(loc.locationId)}>
                  Törlés
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{isEdit ? "Helyszín szerkesztése" : "Új helyszín felvétele"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 360 }}
      >
        <div>
          <label>
            Név:
            <input
              name="locationName"
              value={form.locationName}
              onChange={handleChange}
              required
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
            Cím:
            <input
              name="address"
              value={form.address}
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
            Szállás (accomodation):
            <input
              name="accomodation"
              type="number"
              value={form.accomodation}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Bérelhető?
            <input
              name="rentable"
              type="checkbox"
              checked={form.rentable}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Open Mic?
            <input
              name="openMic"
              type="checkbox"
              checked={form.openMic}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Preferált műfaj:
            <input
              name="genrePref"
              value={form.genrePref}
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
