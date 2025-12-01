// src/LoginPage.jsx
import { useState } from "react";

export default function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();

    if (!res.ok) {
      setError(text || "Sikertelen bejelentkezés");
      return;
    }

    let user = null;
    try {
      user = JSON.parse(text);
    } catch {
      setError("Érvénytelen válasz a szervertől");
      return;
    }

    onLogin(user);
  };

  return (
    <div style={{ padding: 20 }}>
      {onBack && (
        <button onClick={onBack} style={{ marginBottom: 16 }}>
          ← Vissza
        </button>
      )}

      <h1>Bejelentkezés</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 320 }}
      >
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Jelszó:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">Belépés</button>
      </form>
    </div>
  );
}
