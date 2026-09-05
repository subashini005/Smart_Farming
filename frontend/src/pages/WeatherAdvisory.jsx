import { useState } from "react";
import axios from "axios";
import { pythonApiBase } from "../config";
import { useLanguage } from "../LanguageContext";

const API = pythonApiBase;

export default function WeatherAdvisory() {
  const [district, setDistrict] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t, translateBackend } = useLanguage();

  const analyzeWeather = async () => {
    if (!district) {
      alert(t("enterDistrict"));
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post(`${API}/weather-advisory`, {
        district: district,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert(t("errorFetchingWeather"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-card">
        <h2 className="title">🌦 {t("weatherTitle")}</h2>
        <input type="text" placeholder={t("enterDistrict")} value={district} onChange={(e) => setDistrict(e.target.value)}/>
        <button className="primary-btn" onClick={analyzeWeather}>{loading ? t("analyzingWeather") : t("analyzeRisk")}</button>
      </div>
      {loading && (
        <div className="card placeholder">
          {t("fetchingWeather")}
        </div>
      )}
      {result && (
        <div className="result-card">
          <h3>📍 {t("districtResult")}: {result.district}</h3>
          <div className="weather-grid">
            <p>🌡 <strong>{t("temperature")}:</strong> {result.temperature ?? "N/A"}</p>
            <p>💧 <strong>{t("humidity")}:</strong> {result.humidity ?? "N/A"}</p>
            <p>🌧 <strong>{t("rainfall")}:</strong> {result.rainfall ?? "N/A"}</p>
            <p>💨 <strong>{t("windSpeed")}:</strong> {result.wind_speed ?? "N/A"}</p>
          </div>
          <br />
          <h3>🌿 {t("riskAnalysis")}</h3>
          {Array.isArray(result.plant_risk_analysis) && result.plant_risk_analysis.length > 0 ? (
            result.plant_risk_analysis.map((risk, index) => {
              if (typeof risk === "string") {
                return (
                  <div key={index} className="risk-card success">
                    <h4>{translateBackend(risk)}</h4>
                  </div>
                );
              }
              return (
                <div key={index} className={`risk-card ${
                    risk.level === "High" ? "error" : risk.level === "Medium" ? "warning" : "success"
                  }`}
                >
                    <h4>{translateBackend(risk.risk_type) || "Risk"}</h4>
                  <p><strong>{t("riskLevel")}:</strong> {translateBackend(risk.level) || "Unknown"}</p>
                  <p><strong>{t("impact")}:</strong> {translateBackend(risk.description) || "-"}</p>
                  <p><strong>{t("prevention")}:</strong> {translateBackend(risk.prevention) || "-"}</p>
                </div>
              );
            })
          ) : (
            <p>{t("noRiskData")}</p>
          )}
        </div>
      )}
    </div>
  )}