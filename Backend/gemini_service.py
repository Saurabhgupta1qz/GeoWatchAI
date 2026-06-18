import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
print("API KEY:", os.getenv("GEMINI_API_KEY")[:10])

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


model = genai.GenerativeModel("gemini-2.5-flash")

def analyze_location(latitude, longitude):

    prompt = f"""
Analyze this location.

Latitude: {latitude}
Longitude: {longitude}

Return ONLY valid JSON:

{{
  "risk_score": integer,
  "priority": "LOW|MEDIUM|HIGH|CRITICAL",
  "findings": [
    "...",
    "...",
    "..."
  ]
}}

Use consistent scoring for identical coordinates.
Do not vary results randomly.
"""

    response = model.generate_content(prompt)

    return response.text