import { useState } from "react";
import axios from "axios";
import { pythonApiBase } from "../config";
import { useLanguage } from "../LanguageContext";

const API = pythonApiBase;

export default function FarmDetails() {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t, translateBackend } = useLanguage();

  const analyze = async () => {
    if (!form.location && !form.soil_type && !form.sowing_month && !form.nitrogen && !form.phosphorus && !form.potassium && !form.ph && !form.rainfall && !form.humidity) {
      alert(t("loginRequired"));
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API}/farm-details`, form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert(t("serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="FarmPage-container">
      <div className="card">
        <h2 className="title">🌾 {t("farmTitle")}</h2>
        <div className="form-grid">
          <input placeholder={`${t("district")} (${t("example")}: Salem)`} onChange={e => setForm({ ...form, location: e.target.value })} />
          <input placeholder={`${t("sowingMonth")} (${t("example")}: June)`} onChange={e => setForm({ ...form, sowing_month: e.target.value })} />
          <input placeholder={`${t("soilType")} (${t("example")}: Loamy)`} onChange={e => setForm({ ...form, soil_type: e.target.value })} />
          <input type="number" placeholder={`${t("nitrogen")} (${t("unitKgPerAcre")}, ${t("example")}: 80)`} onChange={e => setForm({ ...form, nitrogen: +e.target.value })} />
          <input type="number" placeholder={`${t("phosphorus")} (${t("unitKgPerAcre")}, ${t("example")}: 40)`} onChange={e => setForm({ ...form, phosphorus: +e.target.value })} />
          <input type="number" placeholder={`${t("potassium")} (${t("unitKgPerAcre")}, ${t("example")}: 70)`} onChange={e => setForm({ ...form, potassium: +e.target.value })} />
          <input type="number" step="0.1" placeholder={`${t("soilPh")} (${t("example")}: 6.5)`} onChange={e => setForm({ ...form, ph: +e.target.value })} />
          <input type="number" placeholder={`${t("rainfall")} (${t("unitMm")}, ${t("example")}: 800)`} onChange={e => setForm({ ...form, rainfall: +e.target.value })} />
          <input type="number" placeholder={`${t("humidity")} (${t("unitPercent")}, ${t("example")}: 65)`} onChange={e => setForm({ ...form, humidity: +e.target.value })} />
        </div>
        <button className="primary-btn" onClick={analyze}>{loading ? t("analyzing") : t("analyzeFarm")}</button>
      </div>

      {result && (
        <div className={`result-card ${result.crop_suitability === "Yes" ? "success" : "error"}`}>
          <h3>{result.crop_suitability === "Yes" ? `✅ ${t("suitable")}` : `❌ ${t("notSuitable")}`}</h3>
          {result.positive_factors && result.positive_factors.length > 0 && (
            <>
              <h4>🌱 {t("positiveFactors")}</h4>
              <ul>
                {result.positive_factors.map((item, index) => (
                  <li key={index}>{translateBackend(item)}</li>
                ))}
              </ul>
            </>
          )}
          {result.problem_factors && result.problem_factors.length > 0 && (
            <>
              <h4>⚠ {t("issuesFound")}</h4>
              <ul>
                {result.problem_factors.map((item, index) => (
                  <li key={index}>{translateBackend(item)}</li>
                ))}
              </ul>
            </>
          )}
          {result.recommendations && (
            <>
              <h4>💡 {t("recommendation")}</h4>
              <p>{translateBackend(result.recommendations)}</p>
            </>
          )}
          {result.water_and_fertilizer && (
            <div style={{ marginTop: "15px" }}>
              <p>
                <strong>💧 {t("waterRequired")}:</strong>{" "}
                {result.water_and_fertilizer.water_mm}
              </p>
              <p>
                <strong>🌾 {t("fertilizerUsed")}:</strong>{" "}
                {translateBackend(result.water_and_fertilizer.fertilizer_type)}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}