import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8001";

export default function WeatherAdvisory() {
  const [district, setDistrict] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeWeather = async () => {
    if (!district) {
      alert("Please enter district name");
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
      alert("Error fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-card">
        <h2 className="title">🌦 Smart Plant Risk Monitoring</h2>
        <input type="text" placeholder="Enter District (e.g., Salem)" value={district} onChange={(e) => setDistrict(e.target.value)}/>
        <button className="primary-btn" onClick={analyzeWeather}>{loading ? "Analyzing Weather..." : "Analyze Plant Risk"}</button>
      </div>
      {loading && (
        <div className="card placeholder">
          Fetching live weather & analyzing plant risks...
        </div>
      )}
      {result && (
        <div className="result-card">
          <h3>📍 District: {result.district}</h3>
          <div className="weather-grid">
            <p>🌡 <strong>Temperature:</strong> {result.temperature ?? "N/A"}</p>
            <p>💧 <strong>Humidity:</strong> {result.humidity ?? "N/A"}</p>
            <p>🌧 <strong>Rainfall:</strong> {result.rainfall ?? "N/A"}</p>
            <p>💨 <strong>Wind Speed:</strong> {result.wind_speed ?? "N/A"}</p>
          </div>
          <br />
          <h3>🌿 Plant Risk Analysis</h3>
          {Array.isArray(result.plant_risk_analysis) && result.plant_risk_analysis.length > 0 ? (
            result.plant_risk_analysis.map((risk, index) => {
              if (typeof risk === "string") {
                return (
                  <div key={index} className="risk-card success">
                    <h4>{risk}</h4>
                  </div>
                );
              }
              return (
                <div key={index} className={`risk-card ${
                    risk.level === "High" ? "error" : risk.level === "Medium" ? "warning" : "success"
                  }`}
                >
                  <h4>{risk.risk_type || "Risk"}</h4>
                  <p><strong>Risk Level:</strong> {risk.level || "Unknown"}</p>
                  <p><strong>Impact:</strong> {risk.description || "-"}</p>
                  <p><strong>Prevention:</strong> {risk.prevention || "-"}</p>
                </div>
              );
            })
          ) : (
            <p>No plant risk data available</p>
          )}
        </div>
      )}
    </div>
  )}