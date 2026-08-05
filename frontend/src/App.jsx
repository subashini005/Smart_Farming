import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import FarmDetails from "./pages/UserForm";
import PlantGrowthMonitoring from "./pages/PlantGrowthMonitoring";
import DiseaseDetection from "./pages/Disease-Detection";
import WeatherAdvisory from "./pages/WeatherAdvisory";
import YieldPrediction from "./pages/YieldPrediction";
import "./App.css";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farm-details" element={<FarmDetails />} />
        <Route path="/plant-growth" element={<PlantGrowthMonitoring />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/weather-advisory" element={<WeatherAdvisory />} />
        <Route path="/yield-prediction" element={<YieldPrediction />} />
      </Routes>
    </BrowserRouter>
  );
}