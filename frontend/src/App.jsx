import { HashRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import FarmDetails from "./pages/UserForm";
import PlantGrowthMonitoring from "./pages/PlantGrowthMonitoring";
import DiseaseDetection from "./pages/Disease-Detection";
import WeatherAdvisory from "./pages/WeatherAdvisory";
import YieldPrediction from "./pages/YieldPrediction";
import LanguagePage from "./pages/LanguagePage";
import { LanguageProvider } from "./LanguageContext";
import AppShell from "./components/AppShell";
import "./App.css";
export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/choose-language" element={<LanguagePage />} />
          <Route path="/dashboard" element={<AppShell><Dashboard /></AppShell>} />
          <Route path="/farm-details" element={<AppShell><FarmDetails /></AppShell>} />
          <Route path="/plant-growth" element={<AppShell><PlantGrowthMonitoring /></AppShell>} />
          <Route path="/disease-detection" element={<AppShell><DiseaseDetection /></AppShell>} />
          <Route path="/weather-advisory" element={<AppShell><WeatherAdvisory /></AppShell>} />
          <Route path="/yield-prediction" element={<AppShell><YieldPrediction /></AppShell>} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}