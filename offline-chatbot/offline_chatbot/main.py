import torch
from transformers import pipeline
from offline_chatbot.ai_assistant import client

# model_id = 'meta-llama/Llama-3.2-3B'

# pipe = pipeline(
#     'text-generation',
#     model=model_id,
#     torch_dtype=torch.bfloat16,
#     device_map='auto'
# )

conversation = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello"}
]

while True:
    user_input = input("User: ")
    if user_input.lower() == 'exit':
        break

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": user_input,
            }
        ],
        model="llama-3.2-3b-preview",
    )

    print(chat_completion.choices[0].message.content)
