import {useState} from "react"
import axios from "axios"
import { pythonApiBase } from "../config"
import { useLanguage } from "../LanguageContext"

const API=pythonApiBase

const districts = [
"Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore",
"Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram",
"Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai",
"Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai",
"Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi",
"Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli",
"Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai",
"Tiruvarur","Vellore","Viluppuram","Virudhunagar"
]

const seasons = [
"Summer","Winter","Spring","Autumn"
]

const fertilizers = [
"Urea","DAP","NPK","Organic Compost","Vermicompost",
"Potash","Single Super Phosphate","Ammonium Sulphate",
"Bone Meal","Farmyard Manure","Neem Cake","Micronutrient Mix"
]

const pesticides = [
"Neem Oil","Spinosad","Imidacloprid","Chlorpyrifos",
"Biopesticide","Bacillus thuringiensis","Azadirachtin",
"Beauveria bassiana","Emamectin Benzoate",
"Lambda Cyhalothrin","Fipronil","Carbaryl"
]

export default function YieldPrediction(){

const [form,setForm]=useState({})
const [result,setResult]=useState(null)
const [loading,setLoading]=useState(false)
const { t, translateBackend } = useLanguage()

const predict=async()=>{
try{
    setLoading(true)
    const res=await axios.post(`${API}/yield-prediction`, form)
    setResult(res.data)
}catch(err){
    console.error(err)
}finally{
    setLoading(false)
}
}

const getYieldClass = () => {
    if(!result) return ""
    const level = result.yield_level?.toLowerCase()
    if(level?.includes("high")) return "success"
    if(level?.includes("moderate") || level?.includes("medium")) return "warning"
    return "error"
}

return(
    <div className="yield-container">
        <div className="yield-card">
            <h2 className="title">🌾 {t("yieldTitle")}</h2>
            <div className="form-grid">
                <input type="number" placeholder={t("temperature")} onChange={e=>setForm({...form,temperature:+e.target.value})}/>
                <input type="number" placeholder={t("humidity")} onChange={e=>setForm({...form,humidity:+e.target.value})}/>
                <input type="number" placeholder={`${t("rainfall")} (${t("unitMm")}, ${t("example")}: 800)`} onChange={e=>setForm({...form,rainfall:+e.target.value})}/>
                <input type="number" step="0.1" placeholder={`${t("soilPh")} (${t("example")}: 6.5)`} onChange={e=>setForm({...form,ph:+e.target.value})}/>
                <input type="number" placeholder={`${t("nitrogen")} (${t("unitKgPerAcre")}, ${t("example")}: 80)`} onChange={e=>setForm({...form,nitrogen:+e.target.value})}/>
                <input type="number" placeholder={`${t("farmArea")} (${t("example")}: 2)`} onChange={e=>setForm({...form,area:+e.target.value})}/>
                <select defaultValue="" aria-label={t("selectDistrict")} onChange={e=>setForm({...form,district:e.target.value})}>
                    <option value="" disabled>{t("selectDistrict")}</option>
                    {districts.map((d,i)=>(
                        <option key={i} value={d}/>
                    ))}
                </select>
                <select defaultValue="" aria-label={t("selectSeason")} onChange={e=>setForm({...form,season:e.target.value})}>
                    <option value="" disabled>{t("selectSeason")}</option>
                    {seasons.map((d,i)=>(
                        <option key={i} value={d}>{translateBackend(d)}</option>
                    ))}
                </select>
                <select defaultValue="" aria-label={t("selectPesticide")} onChange={e=>setForm({...form,pesticide:e.target.value})}>
                    <option value="" disabled>{t("selectPesticide")}</option>
                    {pesticides.map((d,i)=>(
                        <option key={i} value={d}>{translateBackend(d)}</option>
                    ))}
                </select>
                <select defaultValue="" aria-label={t("selectFertilizer")} onChange={e=>setForm({...form,fertilizer:e.target.value})}>
                    <option value="" disabled>{t("selectFertilizer")}</option>
                    {fertilizers.map((d,i)=>(
                        <option key={i} value={d}>{translateBackend(d)}</option>
                    ))}
                </select>
            </div>
            <button className="primary-btn" onClick={predict}>{loading ? t("analyzing") : t("predictYield")}</button>
        </div>
        {result && (
            <div className={`result-card ${getYieldClass()}`}>
                <h2>{t("expectedYield")} : {result.expected_yield}</h2>
                <p><strong>{t("yieldLevel")} :</strong> {translateBackend(result.yield_level)}</p>
                <p><strong>{t("recommendation")} :</strong> {translateBackend(result.recommendation)}</p>
                {result.positive_factors && (
                    <>
                        <h3>🌱 {t("whyYield")}</h3>
                        <ul>
                            {result.positive_factors.map((item,index)=>(
                                <li key={index}>{translateBackend(item)}</li>
                            ))}
                        </ul>
                    </>
                )}
                {result.next_improvements && result.next_improvements.length > 0 && (
                    <>
                        <h3>🚀 {t("increaseYield")}</h3>
                        <ul>
                            {result.next_improvements.map((item,index)=>(
                                <li key={index}>{translateBackend(item)}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        )}
    </div>
)}