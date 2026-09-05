import React, { useState } from "react";
import { pythonApiBase } from "../config";
import { useLanguage } from "../LanguageContext";

const API = pythonApiBase;

export default function PlantGrowthMonitoring() {

const [days,setDays]=useState("")
const [temperature,setTemperature]=useState("")
const [soilMoisture,setSoilMoisture]=useState("")
const [waterLevel,setWaterLevel]=useState("")
const [actualHeight,setActualHeight]=useState("")
const [result,setResult]=useState(null)
const [loading,setLoading]=useState(false)
const { t, translateBackend } = useLanguage()

const checkGrowth = async()=>{
try{
    setLoading(true);
    const response = await fetch(`${API}/plant-growth`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
    days:Number(days),
    temperature:Number(temperature),
    soil_moisture:Number(soilMoisture),
    water_level:Number(waterLevel),
    actual_height:Number(actualHeight)
})
})

const data = await response.json() 
setResult({
    expected:data.expected_growth,
    actual:Number(actualHeight),
    status:data.status,
    reasons:data.reasons,
    improvements:data.improvements,
    maintain:data.maintain
})
}
catch(err){
    alert(t("serverError"))
}
finally{
    setLoading(false)
}}

return(
    <div className="plant-growth-container">
        <div className="plant-growth-card">
            <h2 className="title">🌱 {t("growthTitle")}</h2>
            <input type="number" placeholder={t("daysAfterPlanting")} onChange={e=>setDays(e.target.value)}/>
            <input type="number" placeholder={t("temperature")} onChange={e=>setTemperature(e.target.value)}/>
            <input type="number" placeholder={t("soilMoisture")} onChange={e=>setSoilMoisture(e.target.value)}/>
            <input type="number" placeholder={t("waterLevel")} onChange={e=>setWaterLevel(e.target.value)}/>
            <input type="number" placeholder={t("actualHeight")} onChange={e=>setActualHeight(e.target.value)}/>
            <button onClick={checkGrowth} className="primary-btn">{loading ? t("predicting") : t("analyzeGrowth")}</button>
        </div>
        {result && (
            <div className={`result-card ${result.status==="Below Standard"?"error":"success"}`}>
                <h3>{t("expectedGrowth")} : {result.expected} cm</h3>
                <h3>{t("actualGrowth")} : {result.actual} cm</h3>
                <p><b>{t("status")} :</b> {translateBackend(result.status)}</p>
                {result.reasons && (
                    <>
                        <p><b>{t("growthAnalysis")} :</b></p>
                        <ul>
                            {result.reasons.map((item,index)=>(
                                <li key={index}>{translateBackend(item)}</li>
                            ))}
                        </ul>
                    </>
                )}
                {result.improvements && result.improvements.length > 0 && (
                    <>
                        <p><b>{t("improve")} :</b></p>
                        <ul>
                            {result.improvements.map((item,index)=>(
                                <li key={index}>{translateBackend(item)}</li>
                            ))}
                        </ul>
                    </>
                )}
                {result.maintain && result.maintain.length > 0 && (
                    <>
                        <p><b>{t("maintain")} :</b></p>
                        <ul>
                            {result.maintain.map((item,index)=>(
                                <li key={index}>{translateBackend(item)}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        )}
    </div>
);
}