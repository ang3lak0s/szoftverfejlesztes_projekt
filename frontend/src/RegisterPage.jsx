// src/RegisterPage.jsx
import { useState } from "react";

export default function RegisterPage({ onRegistered, onBack }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BAND",
    bandName: "",
    bandPhoneNum: "",
    bandEmail: "",
    locationName: "",
    locationAddress: "",
    locationPhoneNum: "",
    locationEmail: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const body = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      band:
        form.role === "BAND"
          ? {
              bandName: form.bandName,
              phoneNum: form.bandPhoneNum,
              email: form.bandEmail,
            }
          : null,
      location:
        form.role === "LOCATION"
          ? {
              locationName: form.locationName,
              address: form.locationAddress,
              phoneNum: form.locationPhoneNum,
              email: form.locationEmail,
            }
          : null,
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const txt = await res.text();

    if (!res.ok) {
      setError(txt || "Sikertelen regisztráció");
      return;
    }

    let createdUser = null;
    try {
      createdUser = JSON.parse(txt);
    } catch {

    }

    setMessage("Sikeres regisztráció!");
    if (onRegistered && createdUser) {
      onRegistered(createdUser);
    }

    setForm({
      name: "",
      email: "",
      password: "",
      role: "BAND",
      bandName: "",
      bandPhoneNum: "",
      bandEmail: "",
      locationName: "",
      locationAddress: "",
      locationPhoneNum: "",
      locationEmail: "",
    });
  };

  return (
    <div style={{ padding: 20 }}>
      {onBack && (
        <button onClick={onBack} style={{ marginBottom: 16 }}>
          ← Vissza
        </button>
      )}

      <h1>Regisztráció</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "lightgreen" }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <label>
          Név:
          <input
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
            <option value="BAND">Banda</option>
            <option value="LOCATION">Helyszín</option>
          </select>
        </label>

        {form.role === "BAND" && (
          <>
            <h3>Új banda adatai</h3>
            <label>
              Banda neve:
              <input
                name="bandName"
                value={form.bandName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Telefonszám:
              <input
                name="bandPhoneNum"
                value={form.bandPhoneNum}
                onChange={handleChange}
              />
            </label>
            <label>
              Banda email:
              <input
                type="email"
                name="bandEmail"
                value={form.bandEmail}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        {form.role === "LOCATION" && (
          <>
            <h3>Új helyszín adatai</h3>
            <label>
              Helyszín neve:
              <input
                name="locationName"
                value={form.locationName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Cím:
              <input
                name="locationAddress"
                value={form.locationAddress}
                onChange={handleChange}
              />
            </label>
            <label>
              Telefonszám:
              <input
                name="locationPhoneNum"
                value={form.locationPhoneNum}
                onChange={handleChange}
              />
            </label>
            <label>
              Helyszín email:
              <input
                type="email"
                name="locationEmail"
                value={form.locationEmail}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        <button type="submit">Regisztráció</button>
      </form>
    </div>
  );
}
