import os

from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def ai_response(user_input):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": user_input,
            }
        ],
        model="llama-3.2-90b-vision-preview",
    )
    return chat_completion.choices[0].message.content
