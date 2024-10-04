from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response

import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import google.generativeai as genai

@csrf_exempt  # This bypasses CSRF protection for API endpoints, adjust as per your security needs
def handle_message(request):
    # Check if the request is a POST
    if request.method != "POST":
        return JsonResponse({"message": "Only POST requests are allowed"}, status=405)

    # Check referer if not in development mode
    referer = request.headers.get('Referer')
    if os.getenv("DEBUG") != "True":
        if not referer or referer != os.getenv("APP_URL"):
            return JsonResponse({"message": "Unauthorized"}, status=401)

    # Parse the body to get the userMessage
    try:
        data = json.loads(request.body)
        user_message = data.get('userMessage')
    except (json.JSONDecodeError, KeyError):
        return JsonResponse({"message": "User message is required"}, status=400)

    if not user_message:
        return JsonResponse({"message": "User message is required"}, status=400)

    # Interact with Google Generative AI
    try:
        genai.configure(api_key=os.environ["GEMINI_KEY"])
        model = genai.GenerativeModel("gemini-1.5-flash")
        result = model.generate_content(user_message)
        ai_response = result.text

        # Format the response similar to the Next.js handler
        formatted_response = (
            ai_response
            .replace("\n", "<br />")  # Convert new lines to <br />
            .replace(r"\*\*(.*?)\*\*", r"<strong>\1</strong>")  # Convert **text** to <strong>text</strong>
            .replace(r"- (.*?)(?=<br>|$)", r"<li>\1</li>")  # Convert bullet points to <li>
        )

        return JsonResponse({"response": formatted_response}, status=200)
    except Exception as e:
        return JsonResponse({"message": e}, status=500)
