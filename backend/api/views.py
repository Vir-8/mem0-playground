import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from mem0 import MemoryClient
from mem0.proxy.main import Mem0
from config.env import env

@csrf_exempt
def handle_message(request):
    # Check if the request is a POST
    if request.method != "POST":
        return JsonResponse({"message": "Only POST requests are allowed"}, status=405)

    # Check referer if not in development mode
    referer = request.headers.get('Referer')
    if os.getenv("DEBUG") != "True":
        if not referer or referer != os.getenv("APP_URL"):
            return JsonResponse({"message": "Unauthorized"}, status=401)

    try:
        data = json.loads(request.body)
        user_message = data.get('userMessage')
        user_id = data.get('userId')
        model = data.get('model')
    except (json.JSONDecodeError, KeyError):
        return JsonResponse({"message": "Missing either user message, user ID or model."}, status=400)

    # Interact with Google Generative AI
    try:
        config = {
            "embedder": {
                "provider": "gemini",
                "config": {
                    "model": "models/text-embedding-004"
                }
            },
            "vector_store": {
                "provider": "qdrant",
                "config": {
                    "collection_name": "test",
                    "embedding_model_dims": 768,
                }
            },
            "llm": {
                "provider": "litellm",
                "config": {
                    "model": model,
                    "temperature": 0.2,
                    "max_tokens": 1500,
                    "api_key": env("GEMINI_API_KEY")
                }
            }
        }

        client = Mem0(api_key=env("MEM0_KEY"), config=config)

        messages = [
          {
            "role": "user",
            "content": user_message,
          }
        ]

        chat_completion = client.chat.completions.create(
            messages=messages,
            model=model,
            user_id=user_id,
            api_key=env("GEMINI_API_KEY")
        )
        formatted_response = (
            chat_completion.choices[0].message.content
            .replace("\n", "<br />")  # Convert new lines to <br />
            .replace(r"\*\*(.*?)\*\*", r"<strong>\1</strong>")  # Convert **text** to <strong>text</strong>
            .replace(r"- (.*?)(?=<br>|$)", r"<li>\1</li>")  # Convert bullet points to <li>
        )

        return JsonResponse({"response": formatted_response}, status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

@csrf_exempt
def fetch_memories(request):
    # Check if the request is a POST
    if request.method != "POST":
        return JsonResponse({"message": "Only POST requests are allowed"}, status=405)

    # Check referer if not in development mode
    referer = request.headers.get('Referer')
    if os.getenv("DEBUG") != "True":
        if not referer or referer != os.getenv("APP_URL"):
            return JsonResponse({"message": "Unauthorized"}, status=401)

    try:
        data = json.loads(request.body)
        user_id = data.get('userId')
    except (json.JSONDecodeError, KeyError):
        return JsonResponse({"message": "User ID is required"}, status=400)

    if not user_id:
        return JsonResponse({"message": "User ID is required"}, status=400)

    try:
        client = MemoryClient(api_key=env("MEM0_KEY"))
        user_memories = client.get_all(user_id=user_id, output_format="v1.1")

        return JsonResponse({"response": user_memories}, status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)

@csrf_exempt
def delete_memories(request):
    # Check if the request is a POST
    if request.method != "POST":
        return JsonResponse({"message": "Only POST requests are allowed"}, status=405)

    # Check referer if not in development mode
    referer = request.headers.get('Referer')
    if os.getenv("DEBUG") != "True":
        if not referer or referer != os.getenv("APP_URL"):
            return JsonResponse({"message": "Unauthorized"}, status=401)

    try:
        data = json.loads(request.body)
        user_id = data.get('userId')
    except (json.JSONDecodeError, KeyError):
        return JsonResponse({"message": "User ID is required"}, status=400)

    if not user_id:
        return JsonResponse({"message": "User ID is required"}, status=400)

    try:
        client = MemoryClient(api_key=env("MEM0_KEY"))
        client.delete_all(user_id=user_id)
        return JsonResponse({"response": "Successfully deleted all memories for user: " + user_id}, status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)
