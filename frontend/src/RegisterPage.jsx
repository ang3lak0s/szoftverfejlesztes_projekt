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
        <div className="login-container">
            {onBack && (
                <button
                    onClick={onBack}
                    className="btn-back"
                    style={{ alignSelf: "flex-start", marginBottom: "20px" }}
                >
                    ← Vissza
                </button>
            )}

            <h1 className="login-title" style={{ textAlign: "center", marginBottom: "24px" }}>
                Regisztráció
            </h1>

            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            <form onSubmit={handleSubmit} className="register-form">
                <label className="input-label">
                    Név:
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </label>

                <label className="input-label">
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </label>

                <label className="input-label">
                    Jelszó:
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </label>

                <label className="input-label">
                    Szerep:
                    <select name="role" value={form.role} onChange={handleChange} className="input-field select-field">
                        <option value="BAND">Banda</option>
                        <option value="LOCATION">Helyszín</option>
                    </select>
                </label>

                {form.role === "BAND" && (
                    <>
                        <h3 className="role-heading">Banda adatai</h3>
                        <label className="input-label">
                            Banda neve:
                            <input
                                name="bandName"
                                value={form.bandName}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </label>
                        <label className="input-label">
                            Telefonszám:
                            <input
                                name="bandPhoneNum"
                                value={form.bandPhoneNum}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </label>
                        <label className="input-label">
                            Banda email:
                            <input
                                type="email"
                                name="bandEmail"
                                value={form.bandEmail}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </label>
                    </>
                )}

                {form.role === "LOCATION" && (
                    <>
                        <h3 className="role-heading">Helyszín adatai</h3>
                        <label className="input-label">
                            Helyszín neve:
                            <input
                                name="locationName"
                                value={form.locationName}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </label>
                        <label className="input-label">
                            Cím:
                            <input
                                name="locationAddress"
                                value={form.locationAddress}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </label>
                        <label className="input-label">
                            Telefonszám:
                            <input
                                name="locationPhoneNum"
                                value={form.locationPhoneNum}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </label>
                        <label className="input-label">
                            Helyszín email:
                            <input
                                type="email"
                                name="locationEmail"
                                value={form.locationEmail}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </label>
                    </>
                )}

                <button type="submit" className="btn-primary login-submit">Regisztráció</button>
            </form>
        </div>
    );
}