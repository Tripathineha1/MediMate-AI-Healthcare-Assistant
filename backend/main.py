from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in environment variables or .env file.")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-3.5-flash")

@app.route("/query", methods=["POST"])
def query():
    data = request.json
    if not data:
        return jsonify({
            "result": "error",
            "message": "Missing JSON request body"
        }), 400

    user_query = data.get("query", "").strip()
    if not user_query:
        return jsonify({
            "result": "error",
            "message": "Query cannot be empty"
        }), 400

    prompt = f"""
You are MediMate, a professional AI Healthcare Assistant.
Your task is to analyze the patient's symptoms and return a structured JSON response.

Patient Symptoms:
"{user_query}"

If the query is NOT related to medical symptoms, health conditions, diseases, first aid, medicines, or general healthcare, respond with this exact JSON structure:
{{
  "is_medical": false,
  "message": "I am MediMate, your AI Healthcare Assistant. I am designed to assist with health-related queries and symptom analysis. Please describe any symptoms you are experiencing so I can help."
}}

If the query IS related to medical symptoms, health, first aid, or healthcare, respond with this exact JSON structure:
{{
  "is_medical": true,
  "possible_condition": "A concise condition name (or names) representing what might be causing these symptoms",
  "severity": "Mild" or "Moderate" or "High",
  "health_risk_score": "X/10" (where X is a risk score integer from 1 to 10 based on how dangerous the symptoms are),
  "emergency_detected": true or false, (set to true if any severe or life-threatening symptoms are present, such as chest pain, breathing difficulty, severe dizziness, loss of consciousness, high fever, or severe sudden pain),
  "recommendations": [
    "First recommendation/care advice",
    "Second recommendation/care advice"
  ],
  "when_to_see_doctor": [
    "Specific warning sign or threshold when professional medical attention is required"
  ]
}}
"""

    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        parsed_response = json.loads(response.text)
        return jsonify({
            "result": "ok",
            "data": parsed_response
        })
    except Exception as e:
        print("Error calling Gemini API:", e)
        return jsonify({
            "result": "error",
            "message": "Failed to analyze symptoms. Please try again later."
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8081))
    app.run(host="0.0.0.0", port=port)