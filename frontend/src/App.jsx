import { useState } from "react";
import "./App.css";

import BandCrud from "./BandCrud";
import LocationCrud from "./LocationCrud";
import UserCrud from "./UserCrud";
import OpenMicEventCrud from "./OpenMicEventCrud";
import OpenMicSlotCrud from "./OpenMicSlotCrud";
import BandList from "./BandList";
import LocationList from "./LocationList";
import FullBandList from "./FullBandList";
import BandClientPage from "./BandClientPage";
import LocationClientPage from "./LocationClientPage";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import logo from './assets/logo.jfif';

const RICKROLL_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1";

const handleLogoClick = () => {
    window.open(RICKROLL_URL, "_blank");
};

const MainMode = ({ authView, setAuthView, onLoginSuccess }) => {
    return (
        <div className="main-layout">
            <header className="app-header">
                <button className="logo-button" onClick={handleLogoClick} title="Kattints ide a titkos linkért!">
                    <div className="logo-content">
                        <img src={logo} alt="BÁLA Logo" className="logo" />
                        <div className="app-title">BÁLA</div>
                    </div>
                </button>

                <div className="auth-buttons">
                    <button className="btn-primary" onClick={() => setAuthView("login")}>
                        Belépés
                    </button>
                    <button className="btn-secondary" onClick={() => setAuthView("register")}>
                        Regisztráció
                    </button>
                </div>
            </header>

            <main className="main-content">
                {authView === "login" && (
                    <div className="auth-box">
                        <LoginPage onLogin={onLoginSuccess} onBack={() => setAuthView("none")} />
                    </div>
                )}

                {authView === "register" && (
                    <div className="auth-box">
                        <RegisterPage onRegistered={onLoginSuccess} onBack={() => setAuthView("none")} />
                    </div>
                )}

                {authView === "none" && (
                    <div className="hero-section">
                        <h1 className="hero-title">Zenekar - Helyszín Rendszer</h1>
                        <p className="hero-text">
                            A leggyorsabb út a tökéletes koncerthez. Keresd meg a zenekarodhoz illő helyszínt, vagy a helyszínedhez illő bandát!
                        </p>
                        <p className="quote">
                            „Ezt az alkalmazást Arnóczki Áron emlékére fejlesztettük, szívünkben örökké él."
                        </p>
                        <div className="mode-selection">
                            <button className="btn-mode-select" onClick={() => setAuthView("register")}>
                                Kezdés (Regisztráció)
                            </button>
                            <button className="btn-mode-select secondary" onClick={() => setAuthView("login")}>
                                Belépés
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};


const AdminDashboard = ({ view, setView, handleLogout }) => {
    const viewsMap = {
        home: { title: "Admin Főoldal", component: null },
        bands: { title: "Zenekarok listázása", component: BandList },
        locations: { title: "Helyszínek listázása", component: LocationList },
        fullBands: { title: "Zenekarok (Teljes Adat)", component: FullBandList },
        bandCrud: { title: "Zenekarok CRUD", component: BandCrud },
        locationCrud: { title: "Helyszínek CRUD", component: LocationCrud },
        userCrud: { title: "Userek CRUD", component: UserCrud },
        eventCrud: { title: "Open Mic Event CRUD", component: OpenMicEventCrud },
        slotCrud: { title: "Open Mic Slot CRUD", component: OpenMicSlotCrud },
    };

    const CurrentComponent = viewsMap[view]?.component;

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <button className="btn-back" onClick={handleLogout}>
                    ← Kilépés az admin felületről
                </button>
                <h1 className="admin-title">Admin Dashboard</h1>
            </header>

            {view === "home" ? (
                <div className="admin-menu">
                    <p className="admin-prompt">Válasszon menüpontot a kezeléshez:</p>
                    <div className="admin-buttons">
                        {Object.entries(viewsMap).filter(([key]) => key !== 'home').map(([key, { title }]) => (
                            <button key={key} className="btn-admin-menu" onClick={() => setView(key)}>
                                {title}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="admin-crud-view">
                    <button className="btn-back" onClick={() => setView("home")}>
                        ← Vissza az admin menübe
                    </button>
                    <h2 className="crud-title">{viewsMap[view].title}</h2>
                    {CurrentComponent && <CurrentComponent onBack={() => setView("home")} />}
                </div>
            )}
        </div>
    );
};

export default function App() {
    const [view, setView] = useState("home");
    const [authView, setAuthView] = useState("none");
    const [currentUser, setCurrentUser] = useState(null);

    const handleLogout = () => {
        setCurrentUser(null);
        setView("home");
        setAuthView("none");
    };

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        setAuthView("none");
        if (user.role === "ADMIN") {
            setView("home");
        }
    };

    if (currentUser) {
        if (currentUser.role === "BAND") {
            return <BandClientPage onBack={handleLogout} band={currentUser.band} user={currentUser} />;
        }
        if (currentUser.role === "LOCATION") {
            return <LocationClientPage onBack={handleLogout} location={currentUser.location} user={currentUser} />;
        }
        if (currentUser.role === "ADMIN") {
            return <AdminDashboard view={view} setView={setView} handleLogout={handleLogout} />;
        }
    }

    return (
        <MainMode
            authView={authView}
            setAuthView={setAuthView}
            onLoginSuccess={handleLoginSuccess}
        />
    );
}