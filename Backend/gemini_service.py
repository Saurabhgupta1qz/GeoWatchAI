import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

def analyze_location(latitude, longitude):
    prompt = f"""
    You are GeoWatch AI, an environmental intelligence agent.

    Analyze this location:

    Latitude: {latitude}
    Longitude: {longitude}

    Return:
    - Risk Score (0-100)
    - Priority (LOW/MEDIUM/HIGH/CRITICAL)
    - 3 Environmental Findings

    Keep the response concise.
    """

    response = model.generate_content(prompt)
    return response.text