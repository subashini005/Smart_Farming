import os
import pandas as pd
import joblib
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, mean_absolute_error, r2_score

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "datasets")
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

print("Training Farm Model...")

farm_df = pd.read_csv(os.path.join(DATASET_DIR, "farm_dataset.csv"))

X_farm = farm_df[
    ["location","sowing_month","soil_type","nitrogen","phosphorus","potassium","ph","rainfall","humidity"]
]

y_farm = farm_df["crop_suitability"]

X_farm = pd.get_dummies(X_farm)

joblib.dump(X_farm.columns, os.path.join(MODEL_DIR, "farm_columns.pkl"))

X_train, X_test, y_train, y_test = train_test_split(
    X_farm,
    y_farm,
    test_size=0.2,
    random_state=42
)

farm_model = GradientBoostingClassifier()

farm_model.fit(X_train, y_train)

print("Farm Accuracy:",
round(accuracy_score(y_test, farm_model.predict(X_test))*100,2), "%")

joblib.dump(farm_model, os.path.join(MODEL_DIR, "farm_model.pkl"))

print("Preparing Disease Dataset...")

disease_df = pd.read_csv(
os.path.join(DATASET_DIR, "disease_dataset.csv")
)

disease_df["clean_name"] = disease_df["disease_name"].str.lower().str.strip()

joblib.dump(
disease_df,
os.path.join(MODEL_DIR, "disease_lookup.pkl")
)

print("Disease dataset ready")

print("Training Smart Farm Yield Model...")

yield_df = pd.read_csv(
os.path.join(DATASET_DIR,"farm_yield_dataset.csv")
)

yield_df = pd.get_dummies(yield_df)

X_yield = yield_df.drop("expected_yield",axis=1)
y_yield = yield_df["expected_yield"]

X_train_y, X_test_y, y_train_y, y_test_y = train_test_split(
X_yield,
y_yield,
test_size=0.2,
random_state=42
)

print("Training Random Forest...")

rf_model = RandomForestRegressor(
n_estimators=300,
max_depth=12,
random_state=42,
n_jobs=-1
)

rf_model.fit(X_train_y,y_train_y)

rf_pred = rf_model.predict(X_test_y)

rf_mae = mean_absolute_error(y_test_y,rf_pred)
rf_r2 = r2_score(y_test_y,rf_pred)

print("Random Forest MAE:", round(rf_mae,2))
print("Random Forest R2:", round(rf_r2,3))

print("Training Gradient Boosting...")

gb_model = GradientBoostingRegressor(
n_estimators=300,
learning_rate=0.05,
max_depth=5,
random_state=42
)

gb_model.fit(X_train_y,y_train_y)

gb_pred = gb_model.predict(X_test_y)

gb_mae = mean_absolute_error(y_test_y,gb_pred)
gb_r2 = r2_score(y_test_y,gb_pred)

print("Gradient Boost MAE:", round(gb_mae,2))
print("Gradient Boost R2:", round(gb_r2,3))

if gb_r2 > rf_r2:
    best_model = gb_model
    model_name = "Gradient Boosting"
else:
    best_model = rf_model
    model_name = "Random Forest"

joblib.dump(
best_model,
os.path.join(MODEL_DIR,"smart_yield_model.pkl")
)

joblib.dump(
X_yield.columns,
os.path.join(MODEL_DIR,"yield_columns.pkl")
)

print("Best Model Selected:", model_name)

print("Smart Yield Model Ready")

print("Training Plant Growth Model...")

growth_df = pd.read_csv(
os.path.join(DATASET_DIR,"plant_growth_dataset.csv")
)

X_growth = growth_df[
["days","temperature","soil_moisture","water_level"]
]

y_growth = growth_df["expected_growth"]

X_train_g, X_test_g, y_train_g, y_test_g = train_test_split(
X_growth,
y_growth,
test_size=0.2,
random_state=42
)

from sklearn.ensemble import RandomForestRegressor

growth_model = RandomForestRegressor(
n_estimators=200,
random_state=42
)

growth_model.fit(X_train_g,y_train_g)

pred = growth_model.predict(X_test_g)

print("Plant Growth MAE:",
round(mean_absolute_error(y_test_g,pred),2))

joblib.dump(
growth_model,
os.path.join(MODEL_DIR,"plant_growth_model.pkl")
)

print("Plant Growth Model Ready")

print("Training Weather Models...")

weather_df = pd.read_csv(
os.path.join(DATASET_DIR, "weather_advisory_dataset.csv")
)

X_weather = weather_df[
["temperature","humidity","rainfall","soil_moisture","nitrogen","month"]
]

y_disease = weather_df["disease_risk"]
y_heat = weather_df["heat_stress"]

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X_weather)

joblib.dump(
scaler,
os.path.join(MODEL_DIR, "weather_scaler.pkl")
)

X_train_w, X_test_w, y_train_d, y_test_d = train_test_split(
X_scaled,
y_disease,
test_size=0.2,
random_state=42
)

_, _, y_train_h, y_test_h = train_test_split(
X_scaled,
y_heat,
test_size=0.2,
random_state=42
)

disease_model = MLPClassifier(
hidden_layer_sizes=(64,32),
max_iter=800
)

heat_model = MLPClassifier(
hidden_layer_sizes=(64,32),
max_iter=800
)

disease_model.fit(X_train_w, y_train_d)
heat_model.fit(X_train_w, y_train_h)

joblib.dump(
disease_model,
os.path.join(MODEL_DIR, "weather_disease_model.pkl")
)

joblib.dump(
heat_model,
os.path.join(MODEL_DIR, "heat_model.pkl")
)

print("Weather Models Ready")

print("ALL MODELS TRAINED SUCCESSFULLY")