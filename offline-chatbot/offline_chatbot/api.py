from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
from ai_assistant import ai_response
from fastapi.middleware.cors import CORSMiddleware

origins = ["*"]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    user_input: str


@app.post("/chat")
def chat(chat_req: ChatRequest):
    generated_response = ai_response(chat_req.user_input)
    return {"response": generated_response}


if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
