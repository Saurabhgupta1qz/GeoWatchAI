# GeoWatch AI

GeoWatch AI is an AI-powered environmental compliance monitoring platform that combines satellite image classification, AI-based risk assessment, and ArmorIQ policy governance to identify potential environmental violations and support compliant decision-making workflows.

## Problem Statement

Illegal mining, deforestation, land encroachment, and environmental violations are often detected late due to manual monitoring processes.

GeoWatch AI helps authorities and environmental organizations monitor high-risk regions using satellite imagery and AI-powered analysis.

---

## Key Features

### AI Location Risk Analysis

* Analyze GPS coordinates
* Generate environmental risk scores
* Identify potential violations
* AI-generated findings and recommendations using Gemini

### Satellite Image Classification

* Upload satellite imagery
* EuroSAT-trained deep learning model
* Predict land-cover categories
* Confidence score generation

### ArmorIQ Policy Governance

* Policy-gated environmental workflows
* Compliance validation before case creation
* Audit logging
* Intent-token based policy verification

### Compliance Case Management

* Create environmental cases
* Generate compliance reports
* Track risk levels
* Escalation workflows

### Audit Logging

* Timestamped actions
* Policy decisions
* Compliance tracking

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion

### Backend

* FastAPI
* Python

### AI & ML

* Google Gemini API
* PyTorch
* TorchVision
* EuroSAT Dataset

### Governance Layer

* ArmorIQ SDK

---

## Project Structure

```text
GeoWatchAI
│
├── Backend
│   ├── armoriq_service.py
│   ├── gemini_service.py
│   ├── satellite_service.py
│   ├── main.py
│   ├── train_eurosat.py
│   ├── test_model.py
│   ├── check_key.py
│   ├── eurosat_model.pth
│   └── uploads/
│
├── Frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AlertCenter.tsx
│   │   │   ├── ArmorIQ.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── InspectionOperations.tsx
│   │   │   ├── SituationRoom.tsx
│   │   │   └── Reports.tsx
│   │   │
│   │   ├── data
│   │   ├── services
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## API Endpoints

### Analyze Coordinates

```http
POST /analyze-location
```

Input:

```json
{
  "latitude": 22.7824,
  "longitude": 82.5939
}
```

---

### Classify Satellite Image

```http
POST /classify-image
```

Upload image using multipart/form-data.

---

### Create Compliance Case

```http
POST /create-case
```

ArmorIQ policy validation is executed before case creation.

---

### Generate Report

```http
POST /generate-report
```

---

### Audit Logs

```http
GET /audit-logs
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd GeoWatchAI
```

---

## Backend Setup

```bash
cd Backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create `.env`

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

ARMORIQ_API_KEY=YOUR_ARMORIQ_API_KEY

ARMORIQ_USER_EMAIL=YOUR_EMAIL
```

Run Backend

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://geowatch-backend-cmrc.onrender.com
```

Swagger Docs:

```text
http://geowatch-backend-cmrc.onrender.com/docs
```

---

## Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

## Demo Workflow

1. Select or enter target coordinates.
2. Run AI coordinate analysis.
3. Upload satellite image.
4. Generate land-cover prediction.
5. Trigger compliance escalation.
6. Validate workflow through ArmorIQ.
7. Review audit logs and findings.

---

## Future Scope

* Real-time satellite feeds
* Multi-temporal image comparison
* Environmental alert subscriptions
* Automated report generation
* Government GIS integration
* Predictive environmental risk modeling

---

## Team

GeoWatch AI Hackathon Team

Built using AI, ML, Satellite Intelligence, and Policy Governance.

