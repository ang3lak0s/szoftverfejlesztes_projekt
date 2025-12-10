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
        <div className="login-container">
            {onBack && (
                <button
                    onClick={onBack}
                    className="btn-back"
                    style={{ alignSelf: "flex-start", marginBottom: "20px" }} // Vissza gomb pozícionálása
                >
                    ← Vissza
                </button>
            )}

            {/* A CÍM KÖZÉPRE IGAZÍTÁSA */}
            <h1 className="login-title" style={{ textAlign: "center", marginBottom: "24px" }}>
                Bejelentkezés
            </h1>

            {error && <p className="error-message">{error}</p>}

            <form
                onSubmit={handleSubmit}
                className="login-form"
            >
                <label className="input-label">
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                    />
                </label>

                <label className="input-label">
                    Jelszó:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                </label>

                <button type="submit" className="btn-primary login-submit">
                    Belépés
                </button>
            </form>
        </div>
    );
}