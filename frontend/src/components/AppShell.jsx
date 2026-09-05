import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

const navigation = [
  { path: "/dashboard", key: "dashboard", icon: "bx-grid-alt" },
  { path: "/farm-details", key: "farmAnalysis", icon: "bx-layer" },
  { path: "/plant-growth", key: "plantGrowth", icon: "bx-trending-up" },
  { path: "/disease-detection", key: "disease", icon: "bx-leaf" },
  { path: "/weather-advisory", key: "weather", icon: "bx-cloud-sun" },
  { path: "/yield-prediction", key: "yield", icon: "bx-bar-chart-alt-2" },
];

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, chooseLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("smart-farming-theme") === "dark");
  const username = location.state?.username || localStorage.getItem("smart-farming-user") || "Farmer";

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("smart-farming-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem("smart-farming-user");
    navigate("/");
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <button className="brand-lockup" onClick={() => navigate("/dashboard")} aria-label="AgriSense AI dashboard">
          <span className="brand-mark"><i className="bx bx-leaf" /></span>
          <span><strong>AgriSense</strong><small>AI AGRICULTURE</small></span>
        </button>
        <div className="sidebar-label">{language === "ta" ? "விவசாய கருவிகள்" : "FARM TOOLS"}</div>
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? "active" : ""}>
              <i className={`bx ${item.icon}`} />
              <span>{t(item.key)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-status"><span className="status-dot" /> {language === "ta" ? "AI சேவை இயங்குகிறது" : "AI services online"}</div>
          <button className="sidebar-logout" onClick={logout}><i className="bx bx-log-out" /> {language === "ta" ? "வெளியேறு" : "Log out"}</button>
        </div>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <div className="breadcrumb"><span>AgriSense AI</span><i className="bx bx-chevron-right" /><strong>{t(navigation.find((item) => location.pathname === item.path)?.key || "dashboard")}</strong></div>
          <div className="topbar-actions">
            <button className="icon-button" onClick={() => setDarkMode((value) => !value)} aria-label="Toggle theme" title="Toggle theme">
              <i className={`bx ${darkMode ? "bx-sun" : "bx-moon"}`} />
            </button>
            <button className="language-switch" onClick={() => chooseLanguage(language === "ta" ? "en" : "ta")}>
              {language === "ta" ? "EN" : "தமிழ்"}
            </button>
            <div className="user-chip"><span className="avatar">{username.charAt(0).toUpperCase()}</span><span className="user-name">{username}</span></div>
          </div>
        </header>
        <section className="app-content">{children}</section>
      </main>

      <nav className="mobile-nav">
        {navigation.slice(0, 5).map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? "active" : ""}>
            <i className={`bx ${item.icon}`} /><span>{t(item.key)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
