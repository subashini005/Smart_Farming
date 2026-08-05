import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8001";

export default function FarmDetails() {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!form.location && !form.soil_type && !form.sowing_month && !form.nitrogen && !form.phosphorus && !form.potassium && !form.ph && !form.rainfall && !form.humidity) {
      alert("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API}/farm-details`, form);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="FarmPage-container">
      <div className="card">
        <h2 className="title">Farm Analysis</h2>
        <div className="form-grid">
          <input placeholder="Enter District Name" onChange={e => setForm({ ...form, location: e.target.value })} />
          <input placeholder="Enter Sowing Month" onChange={e => setForm({ ...form, sowing_month: e.target.value })} />
          <input placeholder="Enter Soil Type(e.g., Loamy, Sandy, Clayey)" onChange={e => setForm({ ...form, soil_type: e.target.value })} />
          <input type="number" placeholder="Enter Nitrogen level(%)" onChange={e => setForm({ ...form, nitrogen: +e.target.value })} />
          <input type="number" placeholder="Enter Phosphorus level(%)" onChange={e => setForm({ ...form, phosphorus: +e.target.value })} />
          <input type="number" placeholder="Enter Potassium level(%)" onChange={e => setForm({ ...form, potassium: +e.target.value })} />
          <input type="number" placeholder="Enter Soil pH level(e.g., 5.5)" onChange={e => setForm({ ...form, ph: +e.target.value })} />
          <input type="number" placeholder="Enter Rainfall level(ml)" onChange={e => setForm({ ...form, rainfall: +e.target.value })} />
          <input type="number" placeholder="Enter Humidity level(%)" onChange={e => setForm({ ...form, humidity: +e.target.value })} />
        </div>
        <button className="primary-btn" onClick={analyze}>{loading ? "Analyzing..." : "Analyze Farm"}</button>
      </div>

      {result && (
        <div className={`result-card ${result.crop_suitability === "Yes" ? "success" : "error"}`}>
          <h3>{result.crop_suitability === "Yes" ? "✅ Suitable" : "❌ Not Suitable"}</h3>
          {result.positive_factors && result.positive_factors.length > 0 && (
            <>
              <h4>🌱 Positive Factors</h4>
              <ul>
                {result.positive_factors.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {result.problem_factors && result.problem_factors.length > 0 && (
            <>
              <h4>⚠ Issues Found</h4>
              <ul>
                {result.problem_factors.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {result.recommendations && (
            <>
              <h4>💡 Recommendation</h4>
              <p>{result.recommendations}</p>
            </>
          )}
          {result.water_and_fertilizer && (
            <div style={{ marginTop: "15px" }}>
              <p>
                <strong>💧 Water Required:</strong>{" "}
                {result.water_and_fertilizer.water_mm}
              </p>
              <p>
                <strong>🌾 Fertilizer:</strong>{" "}
                {result.water_and_fertilizer.fertilizer_type}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}