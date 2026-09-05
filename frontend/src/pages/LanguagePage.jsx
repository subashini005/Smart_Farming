import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

export default function LanguagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, chooseLanguage, t } = useLanguage();
  const username = location.state?.username || "User";

  const continueToDashboard = () => {
    navigate("/dashboard", { replace: true, state: { username } });
  };

  return (
    <main className="language-page">
      <section className="language-card">
        <div className="language-mark">🌾</div>
        <p className="language-eyebrow">{t("smartFarming")}</p>
        <h1>{t("chooseLanguage")}</h1>
        <p className="language-hint">{t("chooseLanguageHint")}</p>
        <div className="language-options" role="group" aria-label={t("chooseLanguage")}>
          <button className={language === "ta" ? "language-option selected" : "language-option"} onClick={() => chooseLanguage("ta")}>
            <strong>தமிழ்</strong>
            <span>தமிழில் பயன்படுத்த</span>
          </button>
          <button className={language === "en" ? "language-option selected" : "language-option"} onClick={() => chooseLanguage("en")}>
            <strong>English</strong>
            <span>Use in English</span>
          </button>
        </div>
        <button className="language-continue" onClick={continueToDashboard}>{t("continue")} <span>→</span></button>
      </section>
    </main>
  );
}
