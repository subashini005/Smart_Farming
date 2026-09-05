import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const username = location.state?.username || "User";

  return (
    <div className="dashboard-container">
      <h1>{t("welcome")}, {username} 👋</h1>
      <p className="subtitle">{t("smartFarming")}</p>

      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">AI FIELD INTELLIGENCE</span>
          <h2>{t("dashboardHero")}</h2>
          <p>{t("dashboardIntro")}</p>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span>AI</span><i className="bx bx-leaf" /></div>
      </section>

      <div className="overview-strip">
        <div><span className="overview-icon"><i className="bx bx-brain" /></span><strong>5</strong><small>AI modules</small></div>
        <div><span className="overview-icon"><i className="bx bx-check-shield" /></span><strong>24/7</strong><small>Decision support</small></div>
        <div><span className="overview-icon"><i className="bx bx-data" /></span><strong>Live</strong><small>Weather insights</small></div>
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card" onClick={() => navigate("/farm-details")}>
          <h2>🌾 {t("farmAnalysis")}</h2>
          <p>{t("farmAnalysisDesc")}</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/plant-growth")}>
          <h2>🌿 {t("plantGrowth")}</h2>
          <p>{t("plantGrowthDesc")}</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/weather-advisory")}>
          <h2>🌦 {t("weather")}</h2>
          <p>{t("weatherDesc")}</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/disease-detection")}>
          <h2>🌿 {t("disease")}</h2>
          <p>{t("diseaseDesc")}</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/yield-prediction")}>
          <h2>🌱 {t("yield")}</h2>
          <p>{t("yieldDesc")}</p>
        </div>
      </div>
    </div>
  );
}