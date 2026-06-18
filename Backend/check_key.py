from dotenv import load_dotenv
import os

load_dotenv()

key = os.getenv("GEMINI_API_KEY")

print("Loaded Key:", key[:10] + "...")
