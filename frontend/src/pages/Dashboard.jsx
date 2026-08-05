import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || "User";

  return (
    <div className="dashboard-container">
      <h1>Welcome, {username} 👋</h1>
      <p className="subtitle">Smart Farming System Overview</p>

      <div className="dashboard-grid">

        <div className="dashboard-card" onClick={() => navigate("/farm-details")}>
          <h2>🌾 Farm Analysis</h2>
          <p>
            Analyze soil nutrients, rainfall, and humidity to check
            crop suitability and fertilizer needs.
          </p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/plant-growth")}>
          <h2>🌿 Plant Growth Monitoring</h2>
          <p>
            Monitor plant growth.
            Compare actual height with expected growth
            and get smart suggestions.
          </p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/weather-advisory")}>
          <h2>🌦 Weather Advisory</h2>
          <p>
            Get real-time disease warning,
            and heat stress alerts based on live weather.
          </p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/disease-detection")}>
          <h2>🌿 Disease Detection</h2>
          <p>
            Detect plant diseases from leaf images and get
            treatment solutions instantly.
          </p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/yield-prediction")}>
          <h2>🌱 Yield Prediction</h2>
          <p>
            Predict expected crop yield based on soil nutrients, weather conditions, 
            rainfall, and cultivation area.
          </p>
        </div>
      </div>
    </div>
  );
}