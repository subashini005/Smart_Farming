from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import joblib
import cv2
from ultralytics import YOLO
import pandas as pd
import requests
import numpy as np
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
DATASET_DIR = os.path.join(BASE_DIR, "datasets")

def _safe_load(path, default=None):
    try:
        return joblib.load(path)
    except:
        return default

irrigation_model = _safe_load(os.path.join(MODEL_DIR, "irrigation_model.pkl"))
plant_growth_model = joblib.load(os.path.join(MODEL_DIR,"plant_growth_model.pkl"))
weather_disease_model = _safe_load(os.path.join(MODEL_DIR, "weather_disease_model.pkl"))
heat_model = _safe_load(os.path.join(MODEL_DIR, "heat_model.pkl"))
weather_scaler = _safe_load(os.path.join(MODEL_DIR, "weather_scaler.pkl"))
farm_model = _safe_load(os.path.join(MODEL_DIR, "farm_model.pkl"))
yield_model = _safe_load(os.path.join(MODEL_DIR, "yield_model.pkl"))
farm_columns = _safe_load(os.path.join(MODEL_DIR, "farm_columns.pkl"), default=[])
disease_df = pd.read_csv(os.path.join(DATASET_DIR, "disease_dataset.csv"))
yolo_model = YOLO(os.path.join(MODEL_DIR, "best.pt"))
print("YOLO CLASSES:", yolo_model.names)
WEATHER_API_KEY = "b1babbca861b504e00d5acc0502357a1"

@app.post("/farm-details")
async def farm_details(data: dict):

    data["location"] = data["location"].title()
    data["sowing_month"] = data["sowing_month"].title()
    data["soil_type"] = data["soil_type"].title()

    nitrogen = data["nitrogen"]
    phosphorus = data["phosphorus"]
    potassium = data["potassium"]
    ph = data["ph"]
    rainfall = data["rainfall"]
    humidity = data["humidity"]
    soil = data["soil_type"]

    score = 0
    total_conditions = 7
    positives = []
    improvements = []

    if 5.5 <= ph <= 7.2:
        score += 1
        positives.append("Soil pH is optimal")
    else:
        improvements.append("Adjust soil pH level to be between 5.5 and 7.2 for eggplant growth")

    if 60 <= nitrogen <= 110:
        score += 1
        positives.append("Nitrogen level good")
    else:
        improvements.append("Nitrogen level not good for eggplant")

    if 25 <= phosphorus <= 60:
        score += 1
        positives.append("Phosphorus supports roots")
    else:
        improvements.append("Phosphorus level not Suitable for eggplant")

    if 50 <= potassium <= 110:
        score += 1
        positives.append("Potassium supports fruit growth")
    else:
        improvements.append("Increase potassium for better yield")

    if 700 <= rainfall <= 1050:
        score += 1
        positives.append("Rainfall adequate for eggplant growth")
    else:
        improvements.append("Adjust irrigation to compensate for low rainfall")

    if 55 <= humidity <= 80:
        score += 1
        positives.append("Humidity favorable for eggplant")
    else:
        improvements.append("Monitor humidity levels and use mulching to retain moisture")

    if soil in ["Loamy", "Sandy Loam"]:
        score += 1
        positives.append("Soil type ideal")
    else:
        improvements.append("Soil type not ideal for eggplant")

    suitability = round((score / total_conditions) * 100, 1)

    return {
        "crop_suitability": "Yes" if score >= 5 else "No",
        "suitability_score": f"{suitability}%",
        "positive_factors": positives,
        "problem_factors": improvements,
        "recommendations": "Maintain balance",
    }

@app.post("/plant-growth")
async def plant_growth(data:dict):

    df = pd.DataFrame([{
        "days":data["days"],
        "temperature":data["temperature"],
        "soil_moisture":data["soil_moisture"],
        "water_level":data["water_level"]
    }])

    pred = plant_growth_model.predict(df)

    expected = float(pred[0])
    actual = data.get("actual_height",0)

    reasons=[]
    improvements=[]
    maintain=[]

    days = data["days"]
    temperature = data["temperature"]
    soil_moisture = data["soil_moisture"]
    water_level = data["water_level"]

    if actual < expected - 3:

        status="Below Standard"

        if temperature < 22:
            reasons.append("Low temperature slowed plant growth")
            improvements.append("Maintain temperature between 22°C to 30°C")

        if soil_moisture < 40:
            reasons.append("Low soil moisture affected root development")
            improvements.append("Increase soil moisture through irrigation")

        if water_level < 15:
            reasons.append("Insufficient irrigation reduced growth rate")
            improvements.append("Increase watering frequency")

        if len(reasons)==0:
            reasons.append("Nutrient deficiency affected plant growth")
            improvements.append("Apply balanced NPK fertilizer")

    elif actual > expected + 3:

        status="Excellent Growth"

        if temperature >= 24 and temperature <= 32:
            reasons.append("Optimal temperature supported rapid growth")
            maintain.append("Maintain current temperature")

        if soil_moisture >= 50:
            reasons.append("Good soil moisture supported root growth")
            maintain.append("Maintain soil moisture")

        if water_level >= 20:
            reasons.append("Adequate irrigation improved growth")
            maintain.append("Maintain irrigation schedule")

        if len(reasons)==0:
            reasons.append("Favorable environmental conditions supported growth")
            maintain.append("Maintain current farming practices")

    else:

        status="Healthy Growth"
        reasons.append("Growth conditions are normal")
        maintain.append("Continue balanced irrigation")
        maintain.append("Maintain fertilizer schedule")

    return {
        "expected_growth": round(expected,2),
        "status": status,
        "reasons": reasons,
        "improvements": improvements,
        "maintain": maintain
    }

@app.post("/disease-detection")
async def disease_detection(file: UploadFile = File(...)):

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = yolo_model.predict(image)
    result = results[0]

    class_id = int(result.probs.top1)
    confidence = float(result.probs.top1conf)

    raw_label = result.names[class_id]

    print("YOLO RAW:", raw_label)

    label = raw_label.lower()

    for word in ["eggplant", "augmented", "_", "-"]:
        label = label.replace(word, "")

    label = label.strip()

    print("CLEANED:", label)

    if "leaf spot" in label or "spot" in label:
        detected = "Leaf Spot Disease"

    elif "mosaic" in label or "virus" in label:
        detected = "Mosaic Virus Disease"

    elif "wilt" in label:
        detected = "Wilt Disease"

    elif "white mold" in label or "mold" in label:
        detected = "White Mold Disease"

    elif "small leaf" in label or "small" in label:
        detected = "Small Leaf Disease"

    elif "insect" in label or "pest" in label:
        detected = "Insect Pest Disease"

    elif "healthy" in label:
        detected = "Healthy Leaf"

    else:
        detected = "Unknown Disease"

    print("FINAL:", detected)

    disease_df["clean"] = disease_df["disease_name"].str.lower().str.strip()

    match = disease_df[
        disease_df["clean"] == detected.lower()
    ]

    if match.empty:
        return {
            "disease_detected": detected,
            "confidence": f"{round(confidence*100,2)}%",
            "cause": "Info not available",
            "solution": "Try better image",
            "fertilizer": "Organic compost",
            "natural_pesticide": "Neem oil"
        }

    row = match.sample(1).iloc[0]

    return {
        "disease_detected": detected,
        "confidence": f"{round(confidence*100,2)}%",
        "cause": row["cause"],
        "solution": row["cure"],
        "fertilizer": row["fertilizer"],
        "natural_pesticide": row["natural_pesticide"]
    }

yield_model = joblib.load(
os.path.join(MODEL_DIR,"smart_yield_model.pkl")
)

yield_columns = joblib.load(
os.path.join(MODEL_DIR,"yield_columns.pkl")
)

@app.post("/yield-prediction")
async def yield_prediction(data:dict):

    df = pd.DataFrame([data])
    df_encoded = pd.get_dummies(df)
    df_encoded = df_encoded.reindex(columns=yield_columns,fill_value=0)

    pred = yield_model.predict(df_encoded)
    yield_value = float(pred[0])

    positives = []
    improvements = []

    temp = data["temperature"]
    humidity = data["humidity"]
    rainfall = data["rainfall"]
    ph = data["ph"]
    nitrogen = data["nitrogen"]
    season = data["season"]
    fertilizer = data["fertilizer"]
    pesticide = data["pesticide"]
    area = data["area"]

    if 22 <= temp <= 32:
        positives.append("Optimal temperature supported eggplant growth")
    elif temp > 32:
        improvements.append("High temperature may reduce yield, use mulching")
    else:
        improvements.append("Low temperature slowed growth")

    if 55 <= humidity <= 75:
        positives.append("Humidity supported healthy plant growth")
    else:
        improvements.append("Maintain humidity between 55% - 75%")

    if rainfall >= 400:
        positives.append("Adequate rainfall improved soil moisture")
    else:
        improvements.append("Increase irrigation for better yield")

    if 5.8 <= ph <= 7:
        positives.append("Soil pH suitable for nutrient absorption")
    else:
        improvements.append("Adjust soil pH using lime or organic compost")

    if nitrogen >= 50:
        positives.append("Nitrogen level supported vegetative growth")
    else:
        improvements.append("Apply nitrogen fertilizer")

    if season == "Summer" or season == "Spring":
        positives.append("Season favorable for eggplant cultivation")
    else:
        improvements.append("Summer or Spring season gives better yield")

    if fertilizer in ["NPK","Organic Compost","Vermicompost"]:
        positives.append("Fertilizer improved crop productivity")
    else:
        improvements.append("Use NPK or organic fertilizers")

    if pesticide in ["Neem Oil","Spinosad","Biopesticide"]:
        positives.append("Pest control improved plant health")
    else:
        improvements.append("Use eco-friendly pest control")

    if area >= 3:
        positives.append("Large cultivation area supports better production")
    else:
        improvements.append("Increase cultivation area size for higher yield")

    if yield_value > 35:
        level="High Yield"
        recommendation="Farm conditions are highly favorable"

    elif yield_value > 20:
        level="Moderate Yield"
        recommendation="Improve irrigation and fertilizer management"

    else:
        level="Low Yield"
        recommendation="Improve soil fertility and pest management"

    return {
        "expected_yield":round(yield_value,2),
        "yield_level":level,
        "positive_factors": positives,
        "next_improvements": improvements,
        "recommendation": recommendation
    }

@app.post("/weather-advisory")
async def weather_advisory(data: dict):

    district = data["district"]

    url = f"https://api.openweathermap.org/data/2.5/weather?q={district},IN&appid={WEATHER_API_KEY}&units=metric"
    res = requests.get(url).json()

    temp = res["main"]["temp"]
    humidity = res["main"]["humidity"]
    rain = res.get("rain", {}).get("1h", 0)

    risks = []

    if temp > 35:
        risks.append({
            "risk_type": "Heat stress",
            "level": "High",
            "description": "High temperature can stress crops.",
            "prevention": "Use shade, irrigation and mulch"
        })
    if rain > 10:
        risks.append({
            "risk_type": "Waterlogging",
            "level": "Medium",
            "description": "Excessive rain can cause root rot.",
            "prevention": "Improve drainage and reduce irrigation"
        })
    if humidity > 85:
        risks.append({
            "risk_type": "Fungal disease",
            "level": "Medium",
            "description": "High humidity can increase fungal risk.",
            "prevention": "Use preventive sprays and improve airflow"
        })

    if not risks:
        risks.append({
            "risk_type": "No significant risk",
            "level": "Low",
            "description": "Weather conditions are currently favorable.",
            "prevention": "Continue regular monitoring and maintain good farm practices."
        })

    wind_speed = res.get("wind", {}).get("speed")

    return {
        "district": district,
        "temperature": f"{temp} °C",
        "humidity": f"{humidity} %",
        "rainfall": f"{rain} mm",
        "wind_speed": f"{wind_speed} m/s" if wind_speed is not None else "N/A",
        "plant_risk_analysis": risks
    }