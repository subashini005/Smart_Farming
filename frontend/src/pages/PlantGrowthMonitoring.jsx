import React, { useState } from "react";
import { pythonApiBase } from "../config";

const API = pythonApiBase;

export default function PlantGrowthMonitoring() {

const [days,setDays]=useState("")
const [temperature,setTemperature]=useState("")
const [soilMoisture,setSoilMoisture]=useState("")
const [waterLevel,setWaterLevel]=useState("")
const [actualHeight,setActualHeight]=useState("")
const [result,setResult]=useState(null)
const [loading,setLoading]=useState(false)

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
    alert("server error")
}
finally{
    setLoading(false)
}}

return(
    <div className="plant-growth-container">
        <div className="plant-growth-card">
            <h2 className="title">🌱 Smart Plant Growth Monitoring</h2>
            <input type="number" placeholder="Days after planting" onChange={e=>setDays(e.target.value)}/>
            <input type="number" placeholder="Temperature (°C)" onChange={e=>setTemperature(e.target.value)}/>
            <input type="number" placeholder="Soil Moisture (%)" onChange={e=>setSoilMoisture(e.target.value)}/>
            <input type="number" placeholder="Water Level (li)" onChange={e=>setWaterLevel(e.target.value)}/>
            <input type="number" placeholder="Actual Height (cm)" onChange={e=>setActualHeight(e.target.value)}/>
            <button onClick={checkGrowth} className="primary-btn">{loading ? "Predicting..." : "Analyze Growth"}</button>
        </div>
        {result && (
            <div className={`result-card ${result.status==="Below Standard"?"error":"success"}`}>
                <h3>Expected Growth : {result.expected} cm</h3>
                <h3>Actual Growth : {result.actual} cm</h3>
                <p><b>Status :</b> {result.status}</p>
                {result.reasons && (
                    <>
                        <p><b>Growth Analysis :</b></p>
                        <ul>
                            {result.reasons.map((item,index)=>(
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </>
                )}
                {result.improvements && result.improvements.length > 0 && (
                    <>
                        <p><b>How to Improve :</b></p>
                        <ul>
                            {result.improvements.map((item,index)=>(
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </>
                )}
                {result.maintain && result.maintain.length > 0 && (
                    <>
                        <p><b>How to Maintain :</b></p>
                        <ul>
                            {result.maintain.map((item,index)=>(
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        )}
    </div>
);
}