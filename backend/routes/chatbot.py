import os
import logging
from flask import Blueprint, request, jsonify
from config import Config
from openai import OpenAI

chatbot_bp = Blueprint('chatbot', __name__)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
# It will automatically use the OPENAI_API_KEY environment variable
try:
    client = OpenAI()
except Exception as e:
    logger.error(f"Failed to initialize OpenAI client: {e}")
    client = None

@chatbot_bp.route('/message', methods=['POST'])
def chat_message():
    try:
        if not client:
            return jsonify({"error": "OpenAI client is not initialized."}), 500

        data = request.json
        user_message = data.get('message', '')
        history = data.get('history', [])
        user_name = data.get('userName', '')

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # System prompt
        system_prompt = (
            "You are the Speakify AI Pronunciation Coach, an intelligent and friendly assistant integrated into the Speakify AI Language Pro application. "
            "Your role is to help users improve their English pronunciation, explain app features, provide troubleshooting advice, and offer language learning tips. "
            "Keep your responses concise, encouraging, and formatted with emojis. "
            f"{'The user you are speaking to is named ' + user_name + '. ' if user_name else ''}"
            "If the user asks about app features (like Practice, Records, Test, or Analysis), explain them briefly. "
            "Do not output markdown headers (e.g. # or ##) or bold markdown, keep it as plain text with emojis as bullet points."
        )

        # Build messages for OpenAI
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add history
        # We only keep the last 6 messages to save tokens and keep context relevant
        for msg in history[-6:]:
            role = "user" if msg.get("type") == "user" else "assistant"
            messages.append({"role": role, "content": msg.get("message", "")})

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        # Call OpenAI API using the new v1 interface
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=250
        )

        bot_reply = response.choices[0].message.content

        return jsonify({"reply": bot_reply}), 200

    except Exception as e:
        logger.error(f"Error in chatbot API: {e}")
        return jsonify({"error": str(e)}), 500
