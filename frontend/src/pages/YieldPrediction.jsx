import {useState} from "react"
import axios from "axios"

const API="http://localhost:8001"

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
            <h2 className="title">🌾 Smart Farm Yield Analysis</h2>
            <div className="form-grid">
                <input placeholder="Temperature (°C)" onChange={e=>setForm({...form,temperature:+e.target.value})}/>
                <input placeholder="Humidity (%)" onChange={e=>setForm({...form,humidity:+e.target.value})}/>
                <input placeholder="Rainfall (li)" onChange={e=>setForm({...form,rainfall:+e.target.value})}/>
                <input placeholder="Soil PH" onChange={e=>setForm({...form,ph:+e.target.value})}/>
                <input placeholder="Nitrogen" onChange={e=>setForm({...form,nitrogen:+e.target.value})}/>
                <input placeholder="Farm Area (Acre)" onChange={e=>setForm({...form,area:+e.target.value})}/>
                <input list="districts" placeholder="Select District" onChange={e=>setForm({...form,district:e.target.value})}/>
                <datalist id="districts">
                    {districts.map((d,i)=>(
                        <option key={i} value={d}/>
                    ))}
                </datalist>
                <input list="seasons" placeholder="Select Season" onChange={e=>setForm({...form,season:e.target.value})}/>
                <datalist id="seasons">
                    {seasons.map((d,i)=>(
                        <option key={i} value={d}/>
                    ))}
                </datalist>
                <input list="pesticides" placeholder="Select Pesticide" onChange={e=>setForm({...form,pesticide:e.target.value})}/>
                <datalist id="pesticides">
                    {pesticides.map((d,i)=>(
                        <option key={i} value={d}/>
                    ))}
                </datalist>
                <input list="fertilizers" placeholder="Select Fertilizer" onChange={e=>setForm({...form,fertilizer:e.target.value})}/>
                <datalist id="fertilizers">
                    {fertilizers.map((d,i)=>(
                        <option key={i} value={d}/>
                    ))}
                </datalist>
            </div>
            <button className="primary-btn" onClick={predict}>{loading ? "Analyzing..." : "Analyze Farm"}</button>
        </div>
        {result && (
            <div className={`result-card ${getYieldClass()}`}>
                <h2>Expected Yield : {result.expected_yield}</h2>
                <p><strong>Yield Level :</strong> {result.yield_level}</p>
                <p><strong>Recommendation :</strong> {result.recommendation}</p>
                {result.positive_factors && (
                    <>
                        <h3>🌱 Why this yield?</h3>
                        <ul>
                            {result.positive_factors.map((item,index)=>(
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </>
                )}
                {result.next_improvements && result.next_improvements.length > 0 && (
                    <>
                        <h3>🚀 How to Increase Yield In Future</h3>
                        <ul>
                            {result.next_improvements.map((item,index)=>(
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        )}
    </div>
)}