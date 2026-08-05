import { useState } from "react";
import axios from "axios";

const API = "http://localhost:8001";

export default function DiseaseDetection(){

const [image,setImage] = useState(null)
const [preview,setPreview] = useState(null)
const [result,setResult] = useState(null)
const [loading,setLoading] = useState(false)
const [progress,setProgress] = useState(0)
const [dragging,setDragging] = useState(false)

const analyze = async()=>{
if(!image){ 
    return alert("Upload leaf image") 
}
try{
    setLoading(true)
    const formData = new FormData()
    formData.append("file",image)
    const res = await axios.post(`${API}/disease-detection`, formData, {
    headers:{'Content-Type':'multipart/form-data'},
    onUploadProgress:(data)=>{
    setProgress(
        Math.round((data.loaded * 100)/data.total)
    )
}
})
setResult(res.data)
}
catch(err){
    console.error(err)
}
finally{
    setLoading(false)
}
}
const reset = ()=>{
    setImage(null)
    setPreview(null)
    setResult(null)
    setProgress(0)
}

const handleDrop = (e)=>{
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
}

const getStatusClass = () => {
    if(!result) return ""
    return result.disease_detected.toLowerCase().includes("healthy") ? "success": "error"
}

return(
    <div className="disease-container">
        <div className="disease-card">
            <h2 className="title">🌿 Leaf Disease Detection</h2>
            <div className={`upload-box ${dragging ? "dragging" : ""}`} onDragOver={(e)=>{e.preventDefault(); setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop}>
                {preview ? (
                    <img src={preview} className="preview-img"/>
                ):(
                <div className="upload-placeholder">
                    <div className="upload-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 21h14"/></svg>
                    </div>
                    <p className="upload-title">Drag leaf image here</p>
                    <span className="upload-sub">or click to browse</span>
                </div>
                )}
                <input type="file" onChange={(e)=>{ setImage(e.target.files[0]), setPreview(URL.createObjectURL(e.target.files[0]))}}/>
            </div>
            {loading && (
                <div className="progress-bar">
                    <div className="progress-fill" style={{width:`${progress}%`}}></div>
                </div>
            )}
            <div className="btn-group">
                <button className="reset-btn" onClick={reset}>↺ Reset</button>
                <button className="primary-btn" onClick={analyze}>{loading ? "Analyzing..." : "Upload & Detect"}</button>
            </div>
        </div>
        {result && (
            <div className={`result-card ${getStatusClass()}`}>
                <h3>Disease</h3>
                <p className={getStatusClass()}>{result.disease_detected}</p>
                <h3>Cause</h3>
                <p>{result.cause}</p>
                <h3>Treatment</h3>
                <p>{result.solution}</p>
                <h3>Fertilizer</h3>
                <p>{result.fertilizer}</p>
                <h3>Organic Prevention</h3>
                <p>{result.natural_pesticide}</p>
            </div>
        )}
    </div>
);
}