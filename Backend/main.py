from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from gemini_service import analyze_location as ai_analyze_location
from armoriq_service import check_policy
import json
from datetime import datetime
from satellite_service import classify_satellite_image
app = FastAPI(title="GeoWatch AI")

latest_case = {
    "case_id": "GW-2026-001",
    "location": "Live Analysis Zone",
    "risk_score": 87,
    "priority": "HIGH",
    "status": "Open"
}

audit_logs = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LocationRequest(BaseModel):
    latitude: float
    longitude: float


class CreateCaseRequest(BaseModel):
    case_id: str | None = None
    location: str | None = "Live Analysis Zone"
    risk_score: int | None = None
    priority: str | None = None
    summary: str | None = None


class ReportRequest(BaseModel):
    case_id: str | None = "GW-2026-001"


def add_audit_log(action, status, policy_decision="NOT_REQUIRED", details=None):
    audit_logs.append({
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "action": action,
        "status": status,
        "policy_decision": policy_decision,
        "details": details or {}
    })


@app.get("/")
def root():
    return {"message": "GeoWatch AI Backend Running"}


@app.post("/analyze-location")
def analyze_location(data: LocationRequest):
    ai_result = ai_analyze_location(data.latitude, data.longitude)
    result = json.loads(ai_result)

    global latest_case
    latest_case = {
        "case_id": "GW-2026-001",
        "location": "Live Analysis Zone",
        "risk_score": result.get("risk_score", 55),
        "priority": result.get("priority", "MEDIUM"),
        "status": "Open"
    }

    add_audit_log(
        action="Location Analysis",
        status="SUCCESS",
        details={
            "latitude": data.latitude,
            "longitude": data.longitude,
            "risk_score": result.get("risk_score"),
            "priority": result.get("priority")
        }
    )

    return {
        "case_id": "GW-2026-001",
        "risk_score": result.get("risk_score", 55),
        "priority": result.get("priority", "MEDIUM"),
        "latitude": data.latitude,
        "longitude": data.longitude,
        "findings": result.get("findings", [])
    }


@app.get("/cases")
def get_cases():
    return [latest_case]


@app.post("/create-case")
def create_case(data: CreateCaseRequest):
    policy = check_policy(
        action="create_case",
        resource="environmental_case",
        params={
            "case_id": data.case_id or "GW-2026-003",
            "location": data.location,
            "risk_score": data.risk_score,
            "priority": data.priority
        }
    )

    if not policy["approved"]:
        add_audit_log(
            action="Case Creation",
            status="DENIED",
            policy_decision="DENIED",
            details=policy
        )

        return {
            "message": "Case creation denied by ArmorIQ policy",
            "armor_policy": policy
        }

    add_audit_log(
        action="Case Created",
        status="SUCCESS",
        policy_decision="APPROVED",
        details=policy
    )

    return {
        "message": "Case created successfully",
        "case_id": data.case_id or "GW-2026-003",
        "status": "Open",
        "armor_policy": policy
    }


@app.post("/generate-report")
def generate_report(data: ReportRequest):
    policy = check_policy(
        action="generate_report",
        resource="compliance_report",
        params={
            "case_id": data.case_id
        }
    )

    if not policy["approved"]:
        add_audit_log(
            action="Report Generation",
            status="DENIED",
            policy_decision="DENIED",
            details=policy
        )

        return {
            "message": "Report generation denied by ArmorIQ policy",
            "armor_policy": policy
        }

    add_audit_log(
        action="Report Generated",
        status="SUCCESS",
        policy_decision="APPROVED",
        details=policy
    )

    return {
        "message": "Compliance report generated successfully",
        "case_id": data.case_id,
        "report_status": "Generated",
        "armor_policy": policy
    }


@app.get("/audit-logs")
def get_audit_logs():
    return audit_logs

from fastapi import UploadFile, File
import os

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/classify-image")
async def classify_image(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        result = classify_satellite_image(file_path)

        return {
            "success": True,
            "prediction": result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }