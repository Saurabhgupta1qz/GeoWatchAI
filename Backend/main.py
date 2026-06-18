from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="GeoWatch AI")
latest_case = {
    "case_id": "GW-2026-001",
    "location": "Live Analysis Zone",
    "risk_score": 87,
    "priority": "HIGH",
    "status": "Open"
}
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary in-memory storage
audit_logs = []

class LocationRequest(BaseModel):
    latitude: float
    longitude: float


@app.get("/")
def root():
    return {
        "message": "GeoWatch AI Backend Running"
    }


@app.post("/analyze-location")
def analyze_location(data: LocationRequest):

    audit_logs.append({
        "action": "Location Analysis",
        "latitude": data.latitude,
        "longitude": data.longitude,
        "status": "SUCCESS"
    })

    global latest_case

    latest_case = {
        "case_id": "GW-2026-001",
        "location": "Live Analysis Zone",
        "risk_score": 89,
        "priority": "HIGH",
        "status": "Open"
    }
 

    return {
        "case_id": "GW-2026-001",
        "risk_score": 89,
        "priority": "HIGH",
        "latitude": data.latitude,
        "longitude": data.longitude,
        "findings": [
            "Vegetation loss detected",
            "Possible mining activity"
        ]
    }


@app.get("/cases")
def get_cases():
    return [latest_case]


@app.post("/create-case")
def create_case():

    audit_logs.append({
        "action": "Case Created",
        "case_id": "GW-2026-003",
        "status": "SUCCESS"
    })

    return {
        "message": "Case created successfully",
        "case_id": "GW-2026-003",
        "status": "Open"
    }


@app.get("/audit-logs")
def get_audit_logs():
    return audit_logs