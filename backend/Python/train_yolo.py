import os
from ultralytics import YOLO

DATASET_PATH = "yolo_dataset"

print("Starting Fresh Training...")

model = YOLO("yolo11n-cls.pt")

model.train(
    data=DATASET_PATH,
    epochs=40,
    imgsz=128,
    batch=8, 
    optimizer="AdamW",
    augment=True,
    cache=False,
    workers=2,
    device="cpu",
    patience=10,
    project="runs/classify",
    name="eggplant_disease"
)

print("Training finished!")