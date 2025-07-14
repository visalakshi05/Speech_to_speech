from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory state
state = {"status": "recording"}
chat_history = []

@app.get("/status")
def get_status():
    return {"status": state["status"]}

@app.post("/status/{new_status}")
def set_status(new_status: str):
    if new_status in ["recording", "speaking"]:
        state["status"] = new_status
    return {"status": state["status"]}

@app.get("/chats")
def get_chats():
    return {"history": chat_history}

@app.post("/add_chat")
def add_chat(user: str = Query(...), ai: str = Query(...)):
    chat_history.append({"user": user, "ai": ai})
    return {"status": "ok"}
