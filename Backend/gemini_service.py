import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise Exception("GEMINI_API_KEY not found in .env file")

# Configure Gemini
genai.configure(api_key=api_key)

# Create model
model = genai.GenerativeModel(
    "gemini-2.5-flash",
    generation_config={
        "temperature": 0
    }
)


def analyze_location(latitude, longitude):
    prompt = f"""
Analyze this location.

Latitude: {latitude}
Longitude: {longitude}

Return ONLY valid JSON in this exact format:

{{
  "risk_score": 0,
  "priority": "LOW",
  "findings": [
    "",
    "",
    ""
  ]
}}

Rules:
- Output ONLY JSON.
- Do NOT use markdown.
- Do NOT use ```json.
- Do NOT add explanations.
- Risk score must be between 0 and 100.
- Priority must be one of LOW, MEDIUM, HIGH, CRITICAL.
- Same coordinates should always produce similar results.
"""

    try:
        response = model.generate_content(prompt)

        text = (response.text or "").strip()

        if not text:
            raise Exception("Gemini returned an empty response.")

        # Remove markdown if Gemini returns it
        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        # Validate JSON
        data = json.loads(text)

        # Ensure required keys exist
        if "risk_score" not in data:
            data["risk_score"] = 50

        if "priority" not in data:
            data["priority"] = "MEDIUM"

        if "findings" not in data:
            data["findings"] = [
                "No findings returned."
            ]

        return json.dumps(data)

    except Exception as e:
        print("========== GEMINI ERROR ==========")
        print(str(e))
        print("==================================")

        # Fallback response
        fallback = {
            "risk_score": 55,
            "priority": "MEDIUM",
            "findings": [
                "Gemini API unavailable.",
                "Fallback analysis generated.",
                "Check API key, internet connection, or Gemini quota."
            ]
        }

        return json.dumps(fallback)